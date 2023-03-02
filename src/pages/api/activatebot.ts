import type { NextApiRequest, NextApiResponse } from "next";
import { signingKey } from "../../constants";
import { waxPeerBot } from "../../bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";
import { updateFloatBot } from "@/bot/updatefloat";
import cronSchedule from "@/bot/cron";

const updateFloatjob = cronSchedule(updateFloatBot, "* */23 * * *");
const priceEmpireBotJob = cronSchedule(priceEmpireBot);
const waxPeerBotJob = cronSchedule(waxPeerBot);

// GET /api/testbot
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      updateFloatjob.start();
      priceEmpireBotJob.start();
      waxPeerBotJob.start();
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
