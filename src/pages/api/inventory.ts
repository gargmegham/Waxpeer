import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { signingKey } from "../../constants";

// GET /api/inventory
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      // verify bearer token
      const jwt = require("jsonwebtoken");
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, signingKey);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      // get inventory
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
        `https://api.waxpeer.com/v1/get-my-inventory?api=${apiKey}&skip=0&game=csgo`,
        requestOptions
      );
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
