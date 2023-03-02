import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "../lib/prisma";
import { WaxPeerSearchItemResult, UpdatedItemsType, ItemInDb } from "../types";

dayjs.extend(relativeTime);

export async function waxPeerBot() {
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

  //if bot is paused return
  if (settings?.paused) {
    console.log("bot is paused");
    return;
  }

  //do not run bot if last run from now is less than wait time
  if (
    dayjs(new Date()).diff(
      new Date(botLastRun?.botLastRun || new Date()),
      "minute"
    ) < maxBotWaitLimit
  ) {
    console.log("bot didn't run waiting...");
    // return;
  }

  const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();
  let updateItemPrice: Array<UpdatedItemsType> = [];
  let listItems: Array<UpdatedItemsType> = [];

  let botRun: Array<ItemInDb> = [];
  let botDidntRun: Array<ItemInDb> = [];

  //loop over all items
  //do not change this loop to forEach or map there is synchronous issue
  for (const itemToBeTraded of itemsNeedTobeTraded) {
    //if the source price cannot be fetched then update the item status with Cannot fetch source price

    //source price need be divided by 100
    // fetch new source price and update the database
    const sourcePrice: number | null = itemToBeTraded.sourcePrice;

    if (!sourcePrice) {
      botDidntRun.push(itemToBeTraded);
      return;
    }

    if (
      !itemToBeTraded.priceRangeMin ||
      !itemToBeTraded.priceRangeMax ||
      !itemToBeTraded.priceRangePercentage
    ) {
      botDidntRun.push(itemToBeTraded);
      return;
    }
    const searchedItems = await searchItemsInWaxPeer(itemToBeTraded.name);

    const itemsWithinPriceRange = searchedItems.filter(
      (item: WaxPeerSearchItemResult) =>
        itemToBeTraded.priceRangeMin &&
        itemToBeTraded.priceRangeMax &&
        itemToBeTraded.priceRangeMin >= item.price / 1000 &&
        item.price / 1000 <= itemToBeTraded.priceRangeMax &&
        item.item_id !== itemToBeTraded.item_id
    );

    let newPrice: number = 0;

    //if items within price range
    if (itemsWithinPriceRange.length) {
      const minPriceFromRange = Math.min(
        ...itemsWithinPriceRange.map(
          (item: WaxPeerSearchItemResult) => item.price / 1000
        )
      );
      console.log(minPriceFromRange, "minPriceFromRange");
      if (itemToBeTraded.undercutByPriceOrPercentage === "percentage") {
        newPrice =
          minPriceFromRange * (itemToBeTraded.undercutPercentage / 100);
      } else {
        newPrice = minPriceFromRange - itemToBeTraded.undercutPrice;
      }
    } else {
      //if there are no items in price range
      if (itemToBeTraded.whenNoOneToUndercutListUsing === "percentage") {
        newPrice = sourcePrice * (itemToBeTraded.priceRangePercentage / 100);
      } else {
        newPrice = itemToBeTraded.priceRangeMax;
      }
    }

    const currentItem = searchedItems.find(
      (item: WaxPeerSearchItemResult) => item.item_id === itemToBeTraded.item_id
    );

    if (currentItem && Object.values(currentItem).length) {
      updateItemPrice.push({
        item_id: currentItem.item_id,
        price: Math.floor(newPrice * 1000),
      });
      console.log(currentItem);
    } else {
      listItems.push({
        item_id: itemToBeTraded.item_id,
        price: Math.floor(newPrice * 1000),
      });
      console.log(listItems);
    }
    botRun.push(itemToBeTraded);
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
  console.log(updateItemPrice, listItems, "djhf");

  // update bot run status
  try {
    await prisma.item.updateMany({
      where: {
        id: {
          in: botDidntRun.map((item) => item.id),
        },
      },
      data: {
        message: "bot didn't run",
        botSuccess: false,
      },
    });
    await prisma.item.updateMany({
      where: {
        id: {
          in: botRun.map((item) => item.id),
        },
      },
      data: {
        message: "bot run sucessfully",
        botSuccess: true,
      },
    });
  } catch (err) {
    console.log("error in updating bot status", err);
  }

  if (updateItemPrice.length) await updateItemPricesOnWaxPeer(updateItemPrice);
  if (listItems.length) await listItemsOnWaxPeer(listItems);
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
    const payload = {
      items,
    };

    console.log(JSON.stringify(payload));

    const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    const apiKey: string = settings?.waxpeerApiKey || "";
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
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
    console.log("listed item", listed);
  } catch (err) {
    console.log("error while listing items", err);
  }
}

async function updateItemPricesOnWaxPeer(items: Array<UpdatedItemsType>) {
  try {
    const payload = {
      items,
    };

    console.log(payload);
    const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    const apiKey: string = settings?.waxpeerApiKey || "";
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
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
    console.log("updated item price", updated);
  } catch (err) {
    console.log("error while updating prices on wax peer");
  }
}
