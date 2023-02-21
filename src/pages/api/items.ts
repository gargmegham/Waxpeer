import type { NextApiRequest, NextApiResponse } from "next";
import { signingKey } from "../../constants";
import prisma from "../../lib/prisma";
import { SelectedItem } from "../../types";

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
      const items: Array<SelectedItem> = req.body.items;
      // create items in prisma model
      const response: any = {};
      for (const item of items) {
        const newItem = await prisma.item.create({
          data: {
            name: item.name,
            type: item.type,
            item_id: String(item.item_id),
            source: item.source,
            sourcePrice: item.sourcePrice,
            currentPrice: 0,
            lastUpdated: item.lastUpdated,
            undercutPrice: item.undercutPrice,
            undercutPercentage: item.undercutPercentage,
            undercutByPriceOrPercentage: item.undercutByPriceOrPercentage,
            priceRangeMin: item.priceRangeMin,
            priceRangeMax: item.priceRangeMax,
            priceRangePercentage: item.priceRangePercentage,
            whenNoOneToUndercutListUsing: item.whenNoOneToUndercutListUsing,
          },
        });
        response[item.item_id] = newItem;
      }
      return res.status(201).json(JSON.stringify(response));
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
          source: item.source,
          sourcePrice: item.sourcePrice,
          lastUpdated: new Date(),
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
      const itemPk: any = req.body.id;
      const item = await prisma.item.findUnique({
        where: { id: itemPk },
      });
      if (!item) {
        return res.status(404).json({ error: "Item not found." });
      }
      const deletedItem = await prisma.item.delete({
        where: { id: itemPk },
      });
      return res.status(200).json({ deletedItem, message: "Item deleted." });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
