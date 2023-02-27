import { SourcePrice } from "./../types";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";
import { WaxPeerSearchItemResult, ListItem } from "../types";

export async function waxPeerBot() {
  const itemsNeedTobeTraded = await prisma.item.findMany();

  //loop over all items
  itemsNeedTobeTraded.map(async (itemToBeTraded) => {
    const minRange: number =
      (itemToBeTraded.priceRangeMin / 100) * itemToBeTraded.sourcePrice;
    const maxRange: number =
      (itemToBeTraded.priceRangeMax / 100) * itemToBeTraded.sourcePrice;

    const searchedItems = await searchItemsInWaxPeer(itemToBeTraded.name);

    const itemsWithinPriceRange = searchedItems.filter(
      (item: WaxPeerSearchItemResult) =>
        minRange >= item.price && item.price <= maxRange
    );

    console.log(minRange, maxRange, itemsWithinPriceRange, searchedItems);

    interface UpdatedItemsType extends WaxPeerSearchItemResult {
      newPrice: number;
    }

    let newPrice: number = 0;

    //if items within price range
    if (itemsWithinPriceRange.length) {
      const minPriceFromRange = Math.min(
        itemsWithinPriceRange.map((item: WaxPeerSearchItemResult) => item.price)
      );
      if (itemToBeTraded.undercutByPriceOrPercentage === "percentage") {
        newPrice = minPriceFromRange * itemToBeTraded.undercutPercentage;
      } else {
        newPrice = minPriceFromRange * itemToBeTraded.undercutPrice;
      }
    } //if there are no items in price range
    else {
      if (itemToBeTraded.whenNoOneToUndercutListUsing === "percentage") {
        newPrice =
          itemToBeTraded.sourcePrice * itemToBeTraded.undercutPercentage;
      } else {
        newPrice = maxRange;
      }
    }

    console.log(itemToBeTraded, newPrice, "updated price");
    const currentItem = searchedItems.findIndex(
      (item: WaxPeerSearchItemResult) => item.item_id === itemToBeTraded.item_id
    );
    console.log(currentItem, "currentItem");

    if (currentItem) {
      updateItemPrice(currentItem);
    } else {
      listItems(currentItem);
    }
  });
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

async function listItems(item: ListItem) {
  console.log("listed item");
}

async function updateItemPrice(item: ListItem) {
  console.log("updated item price");
}
