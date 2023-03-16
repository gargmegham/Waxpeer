import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { signingKey } from "@/constants";
import { Item } from "@/types";

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

// GET /api/listing
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PUT") {
      // verify bearer token
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, signingKey);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      //   update settings
      const values = req.body.values;
      if (values.listUsing !== "price-range" && !values.listingPercentage)
        return res.status(400).json({ error: "Listing Percentage missing!" });
      const updatedSettings = await prisma.settings.update({
        where: {
          id: 1,
        },
        data: {
          noOfItemsRoListAtATime: Number(values.noOfItemsRoListAtATime),
        },
      });
      const latestSourcePrices = await getAllItemPrices(
        updatedSettings.source || "buff"
      );
      // fetch data from priceempire
      const items: Array<Item> = req.body.items;
      // create items in prisma model
      const batchItems = [];
      for (const item of items) {
        if (
          !latestSourcePrices ||
          !latestSourcePrices[item.name] ||
          !latestSourcePrices[item.name][updatedSettings.source] ||
          !latestSourcePrices[item.name][updatedSettings.source].price ||
          Number.isNaN(
            Number(latestSourcePrices[item.name][updatedSettings.source].price)
          ) ||
          latestSourcePrices[item.name][updatedSettings.source].price / 100 >
            values.listItemTo ||
          latestSourcePrices[item.name][updatedSettings.source].price / 100 <
            values.listItemFrom
        )
          continue;
        const newItem = prisma.item.create({
          data: {
            name: item.name,
            type: item.type,
            item_id: String(item.item_id),
            source: updatedSettings.source,
            sourcePrice:
              latestSourcePrices[item.name][updatedSettings.source].price / 100,
            undercutPrice: updatedSettings.undercutPrice,
            undercutPercentage: updatedSettings.undercutPercentage,
            undercutByPriceOrPercentage:
              updatedSettings.undercutByPriceOrPercentage,
            listUsing: values.listUsing,
            listingPercentage: values.listingPercentage
              ? Number(values.listingPercentage)
              : 0,
          },
        });
        batchItems.push(newItem);
      }
      await prisma.$transaction(batchItems);
      return res.status(200).json(updatedSettings);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
