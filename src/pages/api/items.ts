import type { NextApiRequest, NextApiResponse } from "next";
import { signingKey } from "../../constants";
import prisma from "../../lib/prisma";
import { Item } from "../../types";

// POST /api/priceempire
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
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
      // fetch data from priceempire
      const items: Array<Item> = req.body.items;
      const settings = await prisma.settings.findUnique({
        where: { id: 1 },
        include: { priceRange: true },
      });
      if (!settings) {
        return res.status(404).json({ error: "Settings not found." });
      }
      // create items in prisma model
      const batchItems = [];
      for (const item of items) {
        const newItem = prisma.item.create({
          data: {
            name: item.name,
            type: item.type,
            item_id: String(item.item_id),
            source: settings.source,
            undercutPrice: settings.undercutPrice,
            undercutPercentage: settings.undercutPercentage,
            undercutByPriceOrPercentage: settings.undercutByPriceOrPercentage,
          },
        });
        batchItems.push(newItem);
      }
      await prisma.$transaction(batchItems);
      return res.status(201).json(JSON.stringify({}));
    } else if (req.method === "PUT") {
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
      // update details of item in prisma model
      const item: any = req.body.inputs;
      const itemPrismaPk = item.id;
      const itemPrisma = await prisma.item.findUnique({
        where: { id: itemPrismaPk },
      });
      if (!itemPrisma) {
        return res.status(404).json({ error: "Item not found." });
      }
      const updatedItem = await prisma.item.update({
        where: { id: itemPrismaPk },
        data: {
          undercutPrice: item.undercutPrice,
          undercutPercentage: item.undercutPercentage,
          undercutByPriceOrPercentage: item.undercutByPriceOrPercentage,
          priceRangeMin: item.priceRangeMin,
          priceRangeMax: item.priceRangeMax,
          priceRangePercentage: item.priceRangePercentage,
          whenNoOneToUndercutListUsing: item.whenNoOneToUndercutListUsing,
        },
      });
      return res.status(200).json({ updatedItem, message: "Item updated." });
    } else if (req.method === "DELETE") {
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
      // delete item from prisma model
      const itemPks: Array<number> = req.body.ids;
      const deleteItemsBatch = [];
      for (const itemPk of itemPks) {
        if (typeof itemPk !== "number") {
          return res.status(400).json({ error: "Invalid item id." });
        }
        const deleteItem = prisma.item.delete({
          where: { id: itemPk },
        });
        deleteItemsBatch.push(deleteItem);
      }
      await prisma.$transaction(deleteItemsBatch);
      // remove items from waxpeer
      const settings = await prisma.settings.findUnique({
        where: {
          id: 1,
        },
      });
      const apiKey: string = settings?.waxpeerApiKey || "";
      if (apiKey) {
        let myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        let requestOptions = {
          method: "GET",
          headers: myHeaders,
        };
        let url = `https://api.waxpeer.com/v1/remove-items?api=${apiKey}`;
        for (const id of itemPks) {
          url += `&id=${id}`;
        }
        await fetch(url, requestOptions);
      }
      return res.status(200).json({ message: "Item deleted." });
    }
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
