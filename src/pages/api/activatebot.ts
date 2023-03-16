import type { NextApiRequest, NextApiResponse } from "next";
import { mainBot } from "@/bot/index";
import cronSchedule from "@/bot/cron";

const mainBotJob = cronSchedule(mainBot);

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
      mainBotJob.start();
      taskArray.push(mainBotJob);
      return res.status(200).json({ status: true });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
