import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "@/lib/prisma";
import { WaxPeerSearchItemResult, UpdatedItemsType, ItemInDb } from "@/types";

dayjs.extend(relativeTime);

export async function waxPeerBot() {
  try {
    console.log("waxpeer running...");
    const user = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });

    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
      include: { priceRange: true },
    });

    if (settings?.paused) return;
    if (!settings) return;

    const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();

    let updateItemPrice: Array<UpdatedItemsType> = [];
    let listItems: Array<UpdatedItemsType> = [];
    let itemsUpdated: Array<ItemInDb> = [];
    const maxItemsToList = settings.noOfItemsRoListAtATime;

    //do not change this loop to forEach or map there is synchronous issue
    for (const itemToBeTraded of itemsNeedTobeTraded) {
      const itemIdsWithSameName = itemsNeedTobeTraded
        .filter((item) => item.name === itemToBeTraded.name)
        .map((item) => item.item_id);

      if (
        !itemToBeTraded.sourcePrice ||
        ((!itemToBeTraded.priceRangeMin ||
          !itemToBeTraded.priceRangeMax ||
          !itemToBeTraded.priceRangePercentage ||
          !itemToBeTraded.whenNoOneToUndercutListUsing) &&
          itemToBeTraded.listUsing === "price-range")
      ) {
        console.log("itemToBeTraded has some data missing, skipping...");
        continue;
      }
      const sourcePrice: number = itemToBeTraded.sourcePrice;
      const searchedItems = await searchItemsInWaxPeer(
        itemToBeTraded.name,
        settings
      );
      const itemsWithinPriceRange = searchedItems.filter(
        (item: WaxPeerSearchItemResult) =>
          itemToBeTraded.priceRangeMin &&
          itemToBeTraded.priceRangeMax &&
          itemToBeTraded.priceRangeMin <=
            (item.price -
              (itemToBeTraded.listUsing === "price-range"
                ? itemToBeTraded.undercutByPriceOrPercentage === "percentage"
                  ? itemToBeTraded.undercutPercentage * sourcePrice
                  : itemToBeTraded.undercutPrice
                : 0)) /
              1000 &&
          (item.price -
            (itemToBeTraded.listUsing === "price-range"
              ? itemToBeTraded.undercutByPriceOrPercentage === "percentage"
                ? itemToBeTraded.undercutPercentage * sourcePrice
                : itemToBeTraded.undercutPrice
              : 0)) /
            1000 <
            itemToBeTraded.priceRangeMax &&
          !itemIdsWithSameName.includes(item.item_id)
      );
      let newPrice = 0;

      if (itemToBeTraded.listUsing === "price-range") {
        //if any item within price range
        if (itemsWithinPriceRange.length > 0) {
          const minPriceFromRange = Math.min(
            ...itemsWithinPriceRange.map(
              (item: WaxPeerSearchItemResult) => item.price / 1000
            )
          );
          newPrice =
            itemToBeTraded.undercutByPriceOrPercentage === "percentage"
              ? (minPriceFromRange *
                  (100 - itemToBeTraded.undercutPercentage)) /
                100
              : minPriceFromRange - itemToBeTraded.undercutPrice;

          if (
            itemToBeTraded.undercutByPriceOrPercentage !== "percentage" &&
            (newPrice / sourcePrice) * 100 >
              itemToBeTraded.priceRangeUndercutPercentageThreshold
          )
            newPrice =
              (minPriceFromRange * (100 - itemToBeTraded.undercutPercentage)) /
              100;
        } else if (
          itemToBeTraded.priceRangePercentage &&
          itemToBeTraded.priceRangeMax
        ) {
          //if there are no items in price range
          newPrice =
            itemToBeTraded.whenNoOneToUndercutListUsing === "percentage"
              ? sourcePrice * (itemToBeTraded.priceRangePercentage / 100)
              : itemToBeTraded.priceRangeMax;
        }
      } else {
        newPrice = sourcePrice * (itemToBeTraded.listingPercentage / 100);
      }
      const currentItem = searchedItems.find(
        (item: WaxPeerSearchItemResult) =>
          item.item_id == itemToBeTraded.item_id
      );
      if (currentItem && Object.values(currentItem).length > 0) {
        updateItemPrice.push({
          id: itemToBeTraded.id,
          item_id: currentItem.item_id,
          price: Math.floor(newPrice * 1000),
        });
      } else {
        listItems.push({
          id: itemToBeTraded.id,
          item_id: itemToBeTraded.item_id,
          price: Math.floor(newPrice * 1000),
        });
      }
      itemToBeTraded.currentPrice = newPrice;
      itemsUpdated.push(itemToBeTraded);
    }
    //do not run if last run from now is less than wait time
    const maxBotWaitLimitUpdate = settings?.waxpeerRateLimitUpdate || 1;
    if (
      (user && !user.waxpeerLastUpdated) ||
      (user &&
        user.waxpeerLastUpdated &&
        dayjs(new Date()).diff(new Date(user.waxpeerLastUpdated), "minute") >=
          maxBotWaitLimitUpdate &&
        updateItemPrice.length)
    ) {
      for (let i = 0; i < updateItemPrice.length; i += 50)
        await updateItemPricesOnWaxPeer(updateItemPrice.slice(i, i + 50));
      await prisma.user.update({
        where: {
          username: "admin",
        },
        data: {
          waxpeerLastUpdated: new Date(),
        },
      });
    } else console.log("Skiiping update...");
    //do not run if last run from now is less than wait time
    const maxBotWaitLimitList = settings?.waxpeerRateLimitList || 1;
    if (
      (user && !user.waxpeerLastListed) ||
      (user &&
        user.waxpeerLastListed &&
        dayjs(new Date()).diff(new Date(user.waxpeerLastListed), "minute") >=
          maxBotWaitLimitList &&
        listItems.length)
    ) {
      listItemsOnWaxPeer(listItems.slice(0, maxItemsToList), settings);
      await prisma.user.update({
        where: {
          username: "admin",
        },
        data: {
          waxpeerLastListed: new Date(),
        },
      });
    } else console.log("Skiiping listing...");
    console.log("waxpeer completed");
  } catch (err) {
    console.error("error in waxpeer!", err);
  }
}

async function searchItemsInWaxPeer(itemName: string, settings: any) {
  const apiKey: string = settings?.waxpeerApiKey || "";
  let myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  let requestOptions = {
    method: "GET",
    headers: myHeaders,
  };
  const response = await fetch(
    `https://api.waxpeer.com/v1/search-items-by-name?api=${apiKey}&names=${itemName}`,
    requestOptions
  );
  const { items } = await response.json();
  return items;
}

async function listItemsOnWaxPeer(
  items: Array<UpdatedItemsType>,
  settings: any
) {
  try {
    const apiKey: string = settings?.waxpeerApiKey || "";
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("accept", "application/json");
    const payload = {
      items: items.map((item) => ({
        item_id: Number.parseInt(item.item_id),
        price: item.price,
      })),
    };
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
    };
    const response = await fetch(
      `https://api.waxpeer.com/v1/list-items-steam?api=${apiKey}&game=csgo`,
      requestOptions
    );
    const listed = await response.json();
    await prisma.$transaction(
      items.map((item) =>
        prisma.item.update({
          where: {
            id: item.id,
          },
          data: {
            currentPrice: item.price / 1000,
            botSuccess: listed.success ? true : false,
            message: listed.success
              ? "Updated sucessfully"
              : listed.msg
              ? listed.msg
              : "Error while listing item",
          },
        })
      )
    );
  } catch (err) {
    console.error("error while listing items!", err);
  }
}

async function updateItemPricesOnWaxPeer(items: Array<UpdatedItemsType>) {
  try {
    const payload = {
      items: items.map((item) => ({
        item_id: Number.parseInt(item.item_id),
        price: item.price,
      })),
    };
    const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    const apiKey: string = settings?.waxpeerApiKey || "";
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");
    let requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(payload),
    };
    const response = await fetch(
      `https://api.waxpeer.com/v1/edit-items?api=${apiKey}&game=csgo`,
      requestOptions
    );
    const updated = await response.json();
    await prisma.$transaction(
      items.map((item) =>
        prisma.item.update({
          where: {
            id: item.id,
          },
          data: {
            currentPrice: item.price / 1000,
            botSuccess: updated.success ? true : false,
            message: updated.success
              ? "Updated sucessfully"
              : updated.msg
              ? updated.msg
              : "Error while updating price",
          },
        })
      )
    );
  } catch (err) {
    console.error("error while updating prices on waxpeer!");
  }
}
