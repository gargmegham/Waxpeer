import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "../lib/prisma";
import { ItemInDb, PrimsaUpdateArgumnt } from "../types";

dayjs.extend(relativeTime);

export async function updateFloatBot() {
  try {
    const botLastRun = await prisma.user.findUnique({
      where: {
        username: "admin",
      },
    });

    const settings = await prisma.settings.findUnique({
      where: { id: 1 },
      include: { priceRange: true },
    });
    if (settings?.paused) return;

    if (
      dayjs(new Date()).diff(
        new Date(botLastRun?.botLastRun || new Date()),
        "hour"
      ) < 24
    )
      return;

    const itemsNeedTobeTraded: Array<ItemInDb> = await prisma.item.findMany();
    let updateItems: Array<PrimsaUpdateArgumnt> = [];
    for (const itemToTrade of itemsNeedTobeTraded) {
      const items = await getFloat(itemToTrade.name);
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
  } catch (err) {
    console.log("update float bot error");
  }
}

async function getFloat(itemName: string) {
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
    return items;
  } catch (err) {
    console.log("getting float error");
  }
}
