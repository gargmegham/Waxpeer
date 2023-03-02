import type { NextApiRequest, NextApiResponse } from "next";
import cronSchedule from "../../bot/chron";
import { waxPeerBot } from "../../bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";

// GET /api/testbot
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // verify bearer token
      // const jwt = require("jsonwebtoken");
      // const token = req.headers.authorization?.split(" ")[1];
      // if (!token) {
      //   return res.status(401).json({ error: "Unauthorized" });
      // }
      // const decoded = jwt.verify(token, signingKey);
      // if (!decoded) {
      //   return res.status(401).json({ error: "Unauthorized" });
      // }
      //   update settings

      //   cronSchedule(priceEmpireBot);
      //   priceEmpireBot();

      waxPeerBot();
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
