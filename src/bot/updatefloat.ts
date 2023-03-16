import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "@/lib/prisma";
import { ItemInDb, PrimsaUpdateArgumnt } from "@/types";

dayjs.extend(relativeTime);

export async function updateFloat() {
  try {
    console.log("float updating...");
    const floatBotLastRun = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });

    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
      include: { priceRange: true },
    });

    const maxBotWaitLimit = settings?.floatBotFrequency || 1;

    if (settings?.paused) return;
    if (!settings) return;

    //do not run if last run from now is less than wait time
    if (
      floatBotLastRun &&
      floatBotLastRun.floatBotLastRun &&
      dayjs(new Date()).diff(
        new Date(floatBotLastRun.floatBotLastRun),
        "minute"
      ) < maxBotWaitLimit
    ) {
      console.log("float waiting...");
      return;
    }

    const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();
    let updateItems: Array<PrimsaUpdateArgumnt> = [];
    for (const itemToTrade of itemsNeedTobeTraded) {
      const items = await getFloat(itemToTrade.name, itemToTrade.item_id);
      if (items.length > 0)
        updateItems.push({
          where: {
            id: itemToTrade.id,
          },
          data: {
            floatCondition: items[0].float,
          },
        });
    }
    await prisma.$transaction(
      updateItems.map((item) => prisma.item.update(item))
    );
    console.log("float updated!");
  } catch (err) {
    console.error("float updation error!", err);
  }
}

async function getFloat(itemName: string, item_id: string | number) {
  try {
    const settings = await prisma.settings.findUnique({
      where: {
        id: 1,
      },
    });
    const apiKey: string = settings?.waxpeerApiKey || "";
    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    let requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    const response = await fetch(
      `https://api.waxpeer.com/v1/get-items-list?api=${apiKey}&search=${itemName}`,
      requestOptions
    );
    const { items } = await response.json();
    return items.filter(
      (item: any) => String(item.item_id) === String(item_id)
    );
  } catch (err) {
    console.error("getting float error!");
  }
}
