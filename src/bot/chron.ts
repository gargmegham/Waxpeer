import cron from "node-cron";
import { waxPeerBot } from "./bot";

function action() {
  console.log("The bot is running");
  waxPeerBot();
}

export function cronSchedule() {
  const cronExpression = "* * * * *";
  const job = cron.schedule(cronExpression, action);
}
