import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { waxPeerBot } from "@/bot/waxpeer";
import { priceEmpireBot } from "@/bot/priceempire";
import { updateFloat } from "@/bot/updatefloat";

dayjs.extend(relativeTime);

export async function mainBot() {
  try {
    console.log("mainBot started...");
    await priceEmpireBot();
    await waxPeerBot();
    await updateFloat();
    console.log("mainBot completed");
  } catch (err) {
    console.error("error in mainBot!", err);
  }
}
