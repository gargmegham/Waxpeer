import type { NextApiRequest, NextApiResponse } from "next";
import { sources } from "../../constants";

type Source = {
  value: string;
  label: string;
};

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
      const signingKey = "5687w7tfugyewtrf76%^&%$R^UY5&$%7697821689326192836";
      const decoded = jwt.verify(token, signingKey);
      if (!decoded) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const sourceString = sources
        .map((source: Source) => source.value)
        .join(",");
      const apiKey: string = "ab661d74-39c2-4d6b-9529-33c571a9ee45";
      const name: string = encodeURIComponent(req.body.name);
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
      return res.status(200).json(data);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
