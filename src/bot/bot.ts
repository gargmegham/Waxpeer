import type { NextApiRequest, NextApiResponse } from "next";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "../lib/prisma";
import { WaxPeerSearchItemResult, UpdatedItemsType, ItemInDb } from "../types";
import mockedResponse from "../mockedResponse";

dayjs.extend(relativeTime);

export async function waxPeerBot() {
  const botLastRun = await prisma.user.findUnique({
    where: {
      username: "admin",
    },
  });
  const settings = await prisma.settings.findUnique({
    where: { id: 1 },
  });
  const maxBotWaitLimit = Math.max(
    settings?.PriceEmpireRateLimit || 1,
    settings?.waxpeerRateLimit || 1
  );
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
    return;
  }

  const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();
  let updateItemPrice: Array<UpdatedItemsType> = [];
  let listItems: Array<UpdatedItemsType> = [];

  const { items } = mockedResponse;

  //   const items = await getAllItemPrices(itemsNeedTobeTraded[0].source || "buff");
  //replace this with the commented line above on server
  const latestSourcePrices = items;

  //loop over all items
  itemsNeedTobeTraded.map(async (itemToBeTraded: ItemInDb) => {
    //if the source price cannot be fetched then update the item status with Cannot fetch source price
    if (
      !(
        latestSourcePrices[itemToBeTraded.name] &&
        latestSourcePrices[itemToBeTraded.name]?.item &&
        latestSourcePrices[itemToBeTraded.name]?.item.prices[
          itemToBeTraded.source
        ] &&
        latestSourcePrices[itemToBeTraded.name]?.item.prices[
          itemToBeTraded.source
        ]?.sourcePrice
      )
    ) {
      try {
        await prisma.item.update({
          where: {
            id: itemToBeTraded.id,
          },
          data: {
            message: "Cannot fetch source price",
            botSuccess: false,
          },
        });
        console.log("Cannot fetch source price");
      } catch (err) {
        console.log("error in updating bot status", err);
      }
      return;
    }

    //source price need be divided by 100
    // fetch new source price and update the database
    const sourcePrice: number =
      latestSourcePrices[itemToBeTraded.name]?.item.prices[
        itemToBeTraded.source
      ].sourcePrice;

    const minRange: number =
      (itemToBeTraded.priceRangeMin / 100) * (sourcePrice / 100);
    const maxRange: number =
      (itemToBeTraded.priceRangeMax / 100) * (sourcePrice / 100);

    const searchedItems = await searchItemsInWaxPeer(itemToBeTraded.name);

    const itemsWithinPriceRange = searchedItems.filter(
      (item: WaxPeerSearchItemResult) =>
        minRange >= item.price / 1000 &&
        item.price / 1000 <= maxRange &&
        item.item_id !== itemToBeTraded.item_id
    );

    console.log(minRange, maxRange, itemsWithinPriceRange);

    let newPrice: number = 0;

    //if items within price range
    if (itemsWithinPriceRange.length) {
      const minPriceFromRange = Math.min(
        itemsWithinPriceRange.map(
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
    } //if there are no items in price range
    else {
      if (itemToBeTraded.whenNoOneToUndercutListUsing === "percentage") {
        newPrice =
          (sourcePrice / 100) * (itemToBeTraded.priceRangePercentage / 100);
      } else {
        newPrice = maxRange;
      }
    }

    console.log(newPrice, "updated price");
    const currentItem = searchedItems.findIndex(
      (item: WaxPeerSearchItemResult) => item.item_id === itemToBeTraded.item_id
    );

    if (currentItem) {
      updateItemPrice.push({ ...currentItem, newPrice });
    } else {
      listItems.push({ ...currentItem, newPrice });
    }
  });
  await prisma.user.update({
    where: {
      username: "admin",
    },
    data: {
      botLastRun: new Date(),
    },
  });
  console.log(updateItemPrice, listItems, "djhf");
  return;
  updateItemPricesOnWaxPeer(updateItemPrice);
  listItemsOnWaxPeer(listItems);
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
  //POST
  // https://api.waxpeer.com/v1/list-items-steam?api=4d0de41b32c608b308b6e74956a0b57675ce6e83d6788e02cb64db8cc440f2f0&game=csgo
  //SAMPLE PAYLOAD
  //   {
  //     "items": [
  //       {
  //         "item_id": 27440807699,
  //         "price": 2400000
  //       }
  //     ]
  //   }

  try {
    const data = items.map((item: UpdatedItemsType) => ({
      item_id: item.item_id,
      price: Math.floor(item.newPrice * 1000),
    }));

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
      body: JSON.stringify(data),
    };
    const response = await fetch(
      `https://api.waxpeer.com/v1/list-items-steam?api=${apiKey}&game=csgo`,
      requestOptions
    );
    const listed = await response.json();
    console.log("listed item");
  } catch (err) {
    console.log("error while listing items", err);
  }
}

async function updateItemPricesOnWaxPeer(items: Array<UpdatedItemsType>) {
  //POST
  // https://api.waxpeer.com/v1/edit-items?api=4d0de41b32c608b308b6e74956a0b57675ce6e83d6788e02cb64db8cc440f2f0&game=csgo
  //SAMPLE PAYLOAD
  //   {
  //     "items": [
  //       {
  //         "item_id": 27440807699,
  //         "price": 2400000
  //       }
  //     ]
  //   }
  try {
    const data = items.map((item: UpdatedItemsType) => ({
      item_id: item.item_id,
      price: Math.floor(item.newPrice * 1000),
    }));

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
      body: JSON.stringify(data),
    };
    const response = await fetch(
      `https://api.waxpeer.com/v1/edit-items?api=${apiKey}&game=csgo`,
      requestOptions
    );
    const updated = await response.json();
    console.log("updated item price");
  } catch (err) {
    console.log("error while updating prices on wax peer");
  }
}

async function getAllItemPrices(source: string) {
  try {
    const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    const apiKey: string = settings?.priceEmpireApiKey || "";
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    const response = await fetch(
      `https://pricempire.com/api/v3/getAllItems?api_key=${apiKey}&sources=${source}'`,
      requestOptions
    );
    const { items } = await response.json();
    return items;
  } catch (err) {
    console.log("getting prices error", err);
  }
}
