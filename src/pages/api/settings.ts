import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { signingKey } from "@/constants";

// GET /api/inventory
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
      const updatedSettings = await prisma.settings.update({
        where: {
          id: 1,
        },
        data: {
          waxpeerApiKey: String(values.waxpeerApiKey),
          priceEmpireApiKey: String(values.priceEmpireApiKey),
          waxpeerRateLimit: values.waxpeerRateLimit,
          priceEmpireRateLimit: values.priceEmpireRateLimit,
          paused: Boolean(values.paused),
          source: String(values.source),
          undercutPrice: values.undercutPrice,
          undercutPercentage: values.undercutPercentage,
          undercutByPriceOrPercentage: String(
            values.undercutByPriceOrPercentage
          ),
        },
      });
      return res.status(200).json(updatedSettings);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
