import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "@/lib/prisma";
import { ItemInDb } from "@/types";

dayjs.extend(relativeTime);

export async function priceEmpireBot() {
  try {
    console.log("priceempire running...");

    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
      include: { priceRange: true },
    });

    if (!settings || !Object.values(settings).length) return;
    if (settings?.paused) {
      console.log("priceempire paused");
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });
    const maxBotWaitLimit = settings?.priceEmpireRateLimit || 1;

    if (
      user &&
      user.priceEmpireLastRun &&
      dayjs(new Date()).diff(new Date(user.priceEmpireLastRun), "minute") <
        maxBotWaitLimit
    ) {
      console.log("priceempire waiting");
      return;
    }

    const itemsTobeUpdated: Array<ItemInDb> = await prisma.item.findMany();

    const latestSourcePrices = await getAllItemPrices(
      settings.source || "buff"
    );

    const updateBatch = [];
    itemsTobeUpdated.map((itemToBeTraded: ItemInDb) => {
      //if the source price cannot be fetched then update the item status with Cannot fetch source price
      if (
        !latestSourcePrices ||
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
        whenNoOneToUndercutListUsing = "percentage",
        priceRangeUndercutPercentageThreshold = 0;

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
          priceRangeUndercutPercentageThreshold =
            priceRange.priceRangeUndercutPercentageThreshold;
          return;
        }
      });
      // update price range related data
      if (!foundAtLeastOnePriceRange) {
        updateBatch.push(
          prisma.item.update({
            where: {
              id: itemToBeTraded.id,
            },
            data: {
              botSuccess: false,
              message: "Cannot find price range for this item",
              whenNoOneToUndercutListUsing: null,
              priceRangePercentage: null,
              priceRangeMin: null,
              priceRangeMax: null,
            },
          })
        );
        console.log("cannot find price range for this item");
        return;
      } else {
        updateBatch.push(
          prisma.item.update({
            where: {
              id: itemToBeTraded.id,
            },
            data: {
              sourcePrice: sourcePrice,
              whenNoOneToUndercutListUsing,
              priceRangePercentage,
              undercutPrice: settings.undercutPrice,
              undercutPercentage: settings.undercutPercentage,
              priceRangeUndercutPercentageThreshold,
              undercutByPriceOrPercentage: settings.undercutByPriceOrPercentage,
              priceRangeMin,
              botSuccess: true,
              message: "valid price found",
              priceRangeMax,
            },
          })
        );
      }
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
    console.log("priceempire  completed");
  } catch (err) {
    console.error("error during updating from priceempire!", err);
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
    const uri = `https://pricempire.com/api/v3/getAllItems?api_key=${apiKey}&sources=${source}`;
    const response = await fetch(uri, requestOptions);
    return await response.json();
  } catch (err) {
    console.error("getting error from priceempire API!", err);
  }
}
