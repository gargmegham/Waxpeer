import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "../lib/prisma";
import { ItemInDb } from "../types";
// import mockedData from "../../mockedData.js";

dayjs.extend(relativeTime);

export async function priceEmpireBot() {
  console.log("price empire  bot running");
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
      include: { priceRange: true },
    });
    if (!settings || !Object.values(settings).length) return;
    if (settings?.paused) {
      console.log("price empire bot paused");
      return;
    }

    const maxBotWaitLimit = settings?.priceEmpireRateLimit || 1;
    const botLastRun = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });
    if (
      botLastRun &&
      botLastRun.priceEmpireLastRun &&
      dayjs(new Date()).diff(
        new Date(botLastRun.priceEmpireLastRun),
        "minute"
      ) < maxBotWaitLimit
    ) {
      console.log("price empire bot waiting");
      return;
    }
    const itemsTobeUpdated: Array<ItemInDb> = await prisma.item.findMany();
    const latestSourcePrices = await getAllItemPrices(
      settings.source || "buff"
    );
    // const latestSourcePrices: any = mockedData;
    const updateBatch = [];
    itemsTobeUpdated.map((itemToBeTraded: ItemInDb) => {
      //if the source price cannot be fetched then update the item status with Cannot fetch source price
      if (
        !latestSourcePrices[itemToBeTraded.name] ||
        !latestSourcePrices[itemToBeTraded.name][settings.source] ||
        !latestSourcePrices[itemToBeTraded.name][settings.source].price ||
        Number.isNaN(
          Number(latestSourcePrices[itemToBeTraded.name][settings.source].price)
        )
      ) {
        updateBatch.push(
          prisma.item.update({
            where: {
              id: itemToBeTraded.id,
            },
            data: {
              botSuccess: false,
              message: "Cannot fetch source price",
            },
          })
        );
        console.log("cannot fetch source price");
        return;
      }

      const sourcePrice: number =
        latestSourcePrices[itemToBeTraded.name][settings.source].price / 100;
      let priceRangeMin: number = 0,
        priceRangeMax: number = 0,
        priceRangePercentage: number = 0,
        whenNoOneToUndercutListUsing = "percentage";

      let foundAtLeastOnePriceRange = false;
      settings.priceRange.map((priceRange) => {
        if (
          !foundAtLeastOnePriceRange &&
          priceRange.sourcePriceMin <= sourcePrice &&
          priceRange.sourcePriceMax > sourcePrice
        ) {
          priceRangeMin = sourcePrice * (priceRange.priceRangeMin / 100);
          priceRangeMax = sourcePrice * (priceRange.priceRangeMax / 100);
          priceRangePercentage = priceRange.priceRangePercentage;
          whenNoOneToUndercutListUsing =
            priceRange.whenNoOneToUndercutListUsing;
          foundAtLeastOnePriceRange = true;
          console.log("found price range");
          return;
        }
      });
      if (!foundAtLeastOnePriceRange) {
        updateBatch.push(
          prisma.item.update({
            where: {
              id: itemToBeTraded.id,
            },
            data: {
              botSuccess: false,
              message: "Cannot find price range for this item",
            },
          })
        );
        console.log("cannot find price range for this item");
        return;
      } else
        updateBatch.push(
          prisma.item.update({
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
              priceRangeMin,
              botSuccess: true,
              message: "valid price found",
              priceRangeMax,
            },
          })
        );
    });
    updateBatch.push(
      prisma.user.update({
        where: {
          username: "admin",
        },
        data: {
          priceEmpireLastRun: new Date(),
        },
      })
    );
    await prisma.$transaction(updateBatch);
    console.log("price empire bot completed");
  } catch (err) {
    console.log("error during updating from priceempire", err);
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
    console.log("getting error from priceempire API", err);
  }
}
