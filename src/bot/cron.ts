import cron from "node-cron";

export default function cronSchedule(
  action: () => void,
  cronExpression: string = "* * * * *"
) {
  const job = cron.schedule(cronExpression, action, {
    scheduled: false,
  });
  return job;
}
