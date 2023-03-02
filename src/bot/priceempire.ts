import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "../lib/prisma";
import {
  WaxPeerSearchItemResult,
  UpdatedItemsType,
  ItemInDb,
  PrimsaUpdateArgumnt,
} from "../types";
import mockedResponse from "../mockedResponse";

dayjs.extend(relativeTime);

export async function priceEmpireBot() {
  console.log("inside price empire bot");
  const botLastRun = await prisma.user.findUnique({
    where: {
      username: "admin",
    },
  });
  const settings = await prisma.settings.findUnique({
    where: { id: 1 },
    include: { priceRange: true },
  });

  if (!settings || !Object.values(settings).length) return;

  const maxBotWaitLimit = settings?.priceEmpireRateLimit || 1;

  //if bot is paused return
  if (settings?.paused) {
    console.log("price empire bot is paused");
    return;
  }

  //do not run bot if last run from now is less than wait time
  if (
    dayjs(new Date()).diff(
      new Date(botLastRun?.priceEmpireLastRun || new Date()),
      "minute"
    ) < maxBotWaitLimit
  ) {
    console.log("price empire bot didn't run waiting...");
    // return;
  }

  const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();

  // const latestSourcePrices = await getAllItemPrices(settings.source || "buff");
  //replace this with the commented line above on server
  const latestSourcePrices = mockedResponse;

  const updatePromises: Array<PrimsaUpdateArgumnt> = [];

  //loop over all items
  itemsNeedTobeTraded.map(async (itemToBeTraded: ItemInDb) => {
    //if the source price cannot be fetched then update the item status with Cannot fetch source price
    if (
      !(
        latestSourcePrices[itemToBeTraded.name] &&
        latestSourcePrices[itemToBeTraded.name][settings.source] &&
        latestSourcePrices[itemToBeTraded.name][settings.source].price
      )
    ) {
      return;
    }

    //source price need be divided by 100
    // fetch new source price and update the database
    const sourcePrice: number =
      latestSourcePrices[itemToBeTraded.name][settings.source].price;

    let rangeMin: number | null = null;
    let rangeMax: number | null = null;
    let whenNoOneToUndercutListUsing = "percentage";
    let priceRangePercentage: number = 0;

    settings.priceRange.map((priceRange) => {
      if (
        priceRange.sourcePriceMin >= sourcePrice &&
        itemToBeTraded.currentPrice <= priceRange.sourcePriceMax
      ) {
        console.log(priceRange);
        rangeMin = sourcePrice * (priceRange.priceRangeMin / 100);
        rangeMax = sourcePrice * (priceRange.priceRangeMax / 100);
        whenNoOneToUndercutListUsing = priceRange.whenNoOneToUndercutListUsing;
        priceRangePercentage = priceRange.priceRangePercentage;
      }
    });

    console.log(rangeMax, rangeMin, sourcePrice);

    if (rangeMax && rangeMax) {
      const update = {
        where: {
          id: itemToBeTraded.id,
        },
        data: {
          sourcePrice: sourcePrice / 100,
          whenNoOneToUndercutListUsing,
          priceRangePercentage,
          undercutPrice: settings.undercutPrice,
          undercutPercentage: settings.undercutPercentage,
          undercutByPriceOrPercentage: settings.undercutByPriceOrPercentage,
          priceRangeMin: rangeMin,
          priceRangeMax: rangeMax,
        },
      };
      updatePromises.push(update);
    }
  });

  try {
    await prisma.$transaction([
      ...updatePromises.map((item) => prisma.item.update(item)),
      prisma.user.update({
        where: {
          username: "admin",
        },
        data: {
          priceEmpireLastRun: new Date(),
        },
      }),
    ]);
  } catch (err) {
    console.log("error in update priceempire", err);
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
