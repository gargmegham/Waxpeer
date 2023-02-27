import cron from "node-cron";
import { waxPeerBot } from "./bot";

function action() {
  console.log("The bot is running");
  waxPeerBot();
}

export function cronSchedule(timeInMinutes: number) {
  // const cronExpression = createChronExpression(timeInMinutes);
  const cronExpression = "* * * * *";
  console.log(cronExpression, cron.validate(cronExpression));

  const job = cron.schedule(cronExpression, action);

  //   job.start();
  //starts the job
}

function createChronExpression(timeInMinutes: number): string {
  const hours: number = timeInMinutes > 60 ? Math.floor(timeInMinutes / 60) : 0;
  const minutes: number =
    timeInMinutes > 60 ? timeInMinutes % 60 : timeInMinutes;
  const cronExpression: string = `${
    hours ? (minutes ? minutes : "*") : minutes ? "*/" + minutes : "*"
  } ${hours ? "*/" + hours : "*"} * * *`;

  return cronExpression;
}
