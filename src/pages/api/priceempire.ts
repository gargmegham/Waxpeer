import type { NextApiRequest, NextApiResponse } from "next";
import { sourceString, signingKey } from "../../constants";
import { Item } from "../inventory";

// POST /api/priceempire
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
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
      // fetch data from priceempire
      const apiKey: string = "ab661d74-39c2-4d6b-9529-33c571a9ee45";
      const selectedItems: Array<Item> = req.body.selectedItems;
      const response: any = {
        status: true,
        items: {},
        message: "",
      };
      for (const item of selectedItems) {
        const name: string = encodeURIComponent(item.name);
        let myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        const result = await fetch(
          `https://pricempire.com/api/v2/getItemByName/${name}?api_key=${apiKey}&currency=USD&source=${sourceString}`,
          {
            method: "GET",
            headers: myHeaders,
          }
        );
        const data = await result.json();
        response.items[item.name] = data;
        response.status = response.status && data.status;
        if (data.status === false)
          response.message = response.message + data.message + " ";
      }
      return res.status(200).json(response);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
