import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { waxPeerBot } from "@/bot/waxpeer";
import prisma from "@/lib/prisma";
import { priceEmpireBot } from "@/bot/priceempire";

import { updateFloat } from "@/bot/updatefloat";

dayjs.extend(relativeTime);

export async function mainBot() {
  const start = Date.now();
  try {
    console.log("mainBot started...");
    const user = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });
    if (user && user.botRunning) {
      console.warn("Waiting for previous run to finish!");
      return;
    }
    await prisma.user.update({
      where: {
        username: "admin",
      },
      data: { botRunning: true },
    });
    await priceEmpireBot();
    await waxPeerBot();
    await updateFloat();
    await prisma.user.update({
      where: {
        username: "admin",
      },
      data: { botRunning: false },
    });
  } catch (err) {
    await prisma.user.update({
      where: {
        username: "admin",
      },
      data: { botRunning: false },
    });
    console.error("error in mainBot!", err);
  } finally {
    const timeTaken = Date.now() - start;
    console.log(
      "mainBot completed, time taken : " + timeTaken / 1000 + " seconds"
    );
  }
}
