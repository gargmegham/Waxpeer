import type { NextApiRequest, NextApiResponse } from "next";
import { signingKey } from "../../constants";
import { waxPeerBot } from "../../bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";
import { updateFloatBot } from "@/bot/updatefloat";

// GET /api/testbot
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      updateFloatBot();
      waxPeerBot();
      priceEmpireBot();
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
