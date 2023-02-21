import type { NextApiRequest, NextApiResponse } from "next";
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
      let myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      let requestOptions = {
        method: "GET",
        headers: myHeaders,
      };
      const response = await fetch(
        "https://api.waxpeer.com/v1/get-my-inventory?api=4d0de41b32c608b308b6e74956a0b57675ce6e83d6788e02cb64db8cc440f2f0&skip=0&game=csgo",
        requestOptions
      );
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
