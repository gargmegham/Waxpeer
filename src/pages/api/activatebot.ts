import type { NextApiRequest, NextApiResponse } from "next";
import { signingKey } from "../../constants";
import { waxPeerBot } from "../../bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";
import { updateFloatBot } from "@/bot/updatefloat";
import cronSchedule from "@/bot/cron";

const updateFloatjob = cronSchedule(updateFloatBot, "* */23 * * *");
const priceEmpireBotJob = cronSchedule(priceEmpireBot);
const waxPeerBotJob = cronSchedule(waxPeerBot);
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
      updateFloatjob.start();
      priceEmpireBotJob.start();
      waxPeerBotJob.start();
      taskArray.push(updateFloatjob);
      taskArray.push(priceEmpireBotJob);
      taskArray.push(waxPeerBotJob);
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
