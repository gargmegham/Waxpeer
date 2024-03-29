import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "DELETE") {
      // verify bearer token
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.SIGNATURE);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      //   update settings
      const id = req.body.id;
      const deletedPriceRange = await prisma.priceRange.delete({
        where: {
          id: id,
        },
      });
      return res.status(200).json(deletedPriceRange);
    } else if (req.method === "POST") {
      // verify bearer token
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.SIGNATURE);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const values = req.body.values;
      const newPriceRange = await prisma.priceRange.create({
        data: {
          sourcePriceMin: values.sourcePriceMin || 0,
          sourcePriceMax: values.sourcePriceMax,
          priceRangeMin: values.priceRangeMin,
          priceRangeMax: values.priceRangeMax,
          priceRangeUndercutPercentageThreshold:
            values.priceRangeUndercutPercentageThreshold,
          priceRangePercentage: values.priceRangePercentage,
          whenNoOneToUndercutListUsing:
            values.whenNoOneToUndercutListUsing || "percentage",
        },
      });
      return res.status(200).json(newPriceRange);
    } else if (req.method === "PUT") {
      // verify bearer token
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.SIGNATURE);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const values = req.body.values;
      const id = req.body.id;
      const updatedPriceRange = await prisma.priceRange.update({
        where: {
          id: id,
        },
        data: {
          sourcePriceMin: values.sourcePriceMin,
          sourcePriceMax: values.sourcePriceMax,
          priceRangeMin: values.priceRangeMin,
          priceRangeMax: values.priceRangeMax,
          priceRangeUndercutPercentageThreshold:
            values.priceRangeUndercutPercentageThreshold,
          priceRangePercentage: values.priceRangePercentage,
          whenNoOneToUndercutListUsing: values.whenNoOneToUndercutListUsing,
        },
      });
      return res.status(200).json(updatedPriceRange);
    } else if (req.method === "GET") {
      // verify bearer token
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.SIGNATURE);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      await prisma.item.updateMany({
        data: {
          listUsing: "price-range",
        },
      });
      return res.status(200).json({});
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}
