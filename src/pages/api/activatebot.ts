import type { NextApiRequest, NextApiResponse } from "next";
import { waxPeerBot } from "@/bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";
import cronSchedule from "@/bot/cron";
import { updateFloat } from "@/bot/updatefloat";

const priceEmpireBotJob = cronSchedule(priceEmpireBot);
const waxPeerBotJob = cronSchedule(waxPeerBot);
const updateFloatJob = cronSchedule(updateFloat);

let taskArray: any[] = [];

// GET /api/activatebot
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      if (taskArray.length > 0) {
        taskArray.forEach((task) => {
          task.stop();
        });
        taskArray = [];
      }
      priceEmpireBotJob.start();
      waxPeerBotJob.start();
      updateFloatJob.start();
      taskArray.push(priceEmpireBotJob);
      taskArray.push(waxPeerBotJob);
      taskArray.push(updateFloatJob);
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
