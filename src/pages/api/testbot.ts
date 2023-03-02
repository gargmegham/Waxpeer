import type { NextApiRequest, NextApiResponse } from "next";
import { signingKey } from "../../constants";
import { waxPeerBot } from "../../bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";

// GET /api/testbot
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, signingKey);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      priceEmpireBot();
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
