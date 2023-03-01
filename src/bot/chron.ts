import cron from "node-cron";
import { waxPeerBot } from "./waxpeer";
import { priceEmpireBot } from "./priceempire";

function action() {
  waxPeerBot();
  priceEmpireBot();
}

export function cronSchedule() {
  const cronExpression = "* * * * *";
  const job = cron.schedule(cronExpression, action);
}
