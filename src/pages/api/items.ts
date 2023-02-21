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
      return res.status(200).json(JSON.stringify(response));
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
