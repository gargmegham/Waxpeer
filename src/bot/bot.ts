import { SourcePrice } from "./../types";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../lib/prisma";
import { WaxPeerSearchItemResult, ListItem, UpdatedItemsType } from "../types";

export async function waxPeerBot() {
  const itemsNeedTobeTraded = await prisma.item.findMany();
  let updateItemPrice: Array<UpdatedItemsType> = [];
  let listItems: Array<UpdatedItemsType> = [];

  //loop over all items
  itemsNeedTobeTraded.map(async (itemToBeTraded) => {
    //source price need be divided by 100
    // fetch new source price and update the database
    const minRange: number =
      (itemToBeTraded.priceRangeMin / 100) * itemToBeTraded.sourcePrice;
    const maxRange: number =
      (itemToBeTraded.priceRangeMax / 100) * itemToBeTraded.sourcePrice;

    const searchedItems = await searchItemsInWaxPeer(itemToBeTraded.name);

    const itemsWithinPriceRange = searchedItems.filter(
      (item: WaxPeerSearchItemResult) =>
        minRange >= item.price / 1000 &&
        item.price / 1000 <= maxRange &&
        item.item_id !== itemToBeTraded.item_id
    );

    console.log(minRange, maxRange, itemsWithinPriceRange, searchedItems);

    let newPrice: number = 0;

    //if items within price range
    if (itemsWithinPriceRange.length) {
      const minPriceFromRange = Math.min(
        itemsWithinPriceRange.map((item: WaxPeerSearchItemResult) => item.price)
      );
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
          itemToBeTraded.sourcePrice *
          (itemToBeTraded.priceRangePercentage / 100);
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
      updateItemPrice.push(currentItem);
    } else {
      listItems.push(currentItem);
    }
  });
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

async function listItemsOnWaxPeer(item: Array<UpdatedItemsType>) {
  console.log("listed item");
}

async function updateItemPricesOnWaxPeer(item: Array<UpdatedItemsType>) {
  console.log("updated item price");
}
