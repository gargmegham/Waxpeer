import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "@/lib/prisma";
import { WaxPeerSearchItemResult, UpdatedItemsType, ItemInDb } from "@/types";

dayjs.extend(relativeTime);

export async function waxPeerBot() {
  console.log("waxpeer bot running");
  try {
    const botLastRun = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });

    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
      include: { priceRange: true },
    });

    const maxBotWaitLimit = settings?.waxpeerRateLimit || 1;

    if (settings?.paused) return;

    //do not run bot if last run from now is less than wait time
    if (
      botLastRun &&
      botLastRun.botLastRun &&
      dayjs(new Date()).diff(new Date(botLastRun.botLastRun), "minute") <
        maxBotWaitLimit
    ) {
      console.log("waxpeer bot waiting...");
      return;
    }

    const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();
    let updateItemPrice: Array<UpdatedItemsType> = [];
    let listItems: Array<UpdatedItemsType> = [];
    let itemsUpdated: Array<ItemInDb> = [];

    //do not change this loop to forEach or map there is synchronous issue
    for (const itemToBeTraded of itemsNeedTobeTraded) {
      if (
        !itemToBeTraded.sourcePrice ||
        !itemToBeTraded.priceRangeMin ||
        !itemToBeTraded.priceRangeMax ||
        !itemToBeTraded.priceRangePercentage ||
        !itemToBeTraded.whenNoOneToUndercutListUsing
      ) {
        console.log("itemToBeTraded has some data missing, skipping..");
        continue;
      }
      const sourcePrice: number = itemToBeTraded.sourcePrice;
      const searchedItems = await searchItemsInWaxPeer(itemToBeTraded.name);
      const itemsWithinPriceRange = searchedItems.filter(
        (item: WaxPeerSearchItemResult) =>
          itemToBeTraded.priceRangeMin &&
          itemToBeTraded.priceRangeMax &&
          itemToBeTraded.priceRangeMin <= item.price / 1000 &&
          item.price / 1000 < itemToBeTraded.priceRangeMax &&
          item.item_id !== itemToBeTraded.item_id
      );
      let newPrice = 0;

      //if any item within price range
      if (itemsWithinPriceRange.length > 0) {
        const minPriceFromRange = Math.min(
          ...itemsWithinPriceRange.map(
            (item: WaxPeerSearchItemResult) => item.price / 1000
          )
        );
        newPrice =
          itemToBeTraded.undercutByPriceOrPercentage === "percentage"
            ? (minPriceFromRange * (100 - itemToBeTraded.undercutPercentage)) /
              100
            : minPriceFromRange - itemToBeTraded.undercutPrice;
      } else {
        //if there are no items in price range
        newPrice =
          itemToBeTraded.whenNoOneToUndercutListUsing === "percentage"
            ? sourcePrice * (itemToBeTraded.priceRangePercentage / 100)
            : itemToBeTraded.priceRangeMax;
      }
      const currentItem = searchedItems.find(
        (item: WaxPeerSearchItemResult) =>
          item.item_id === itemToBeTraded.item_id
      );
      if (currentItem && Object.values(currentItem).length > 0) {
        updateItemPrice.push({
          id: currentItem.id,
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
      itemsUpdated.push(itemToBeTraded);
    }
    //update bot last run
    await prisma.user.update({
      where: {
        username: "admin",
      },
      data: {
        botLastRun: new Date(),
      },
    });
    // update bot run status
    await prisma.item.updateMany({
      where: {
        id: {
          in: itemsUpdated.map((item) => item.id),
        },
      },
      data: {
        message: "Updated sucessfully",
        botSuccess: true,
      },
    });
    if (updateItemPrice.length)
      await updateItemPricesOnWaxPeer(updateItemPrice);
    if (listItems.length) await listItemsOnWaxPeer(listItems);
  } catch (err) {
    console.log("error in updating bot status", err);
  }
}

async function searchItemsInWaxPeer(itemName: string) {
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

async function listItemsOnWaxPeer(items: Array<UpdatedItemsType>) {
  try {
    const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    const apiKey: string = settings?.waxpeerApiKey || "";
    let myHeaders = new Headers();
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
    console.log("listed", listed, requestOptions.body);
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
    console.log("error while listing items", err);
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
    console.log("error while updating prices on wax peer");
  }
}
