import cron from "node-cron";

function action() {
  console.log("This cron job will run every second");
}

export function cronSchedule(timeInMinutes: number) {
  const cronExpression = createChronExpression(timeInMinutes);
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
