import cron from "node-cron";

export default function cronSchedule(action: () => void) {
  const cronExpression = "* * * * *";
  const job = cron.schedule(cronExpression, action);
}
