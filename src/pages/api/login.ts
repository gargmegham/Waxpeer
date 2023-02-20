import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

// Required fields in body: username, password
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
    const username: string = req.body.username;
    const password: string = req.body.password;
    const result: any = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        email: true,
        password: true,
        name: true,
      },
    });
    if (!result) {
      return res.status(401).json({ error: "Incorrect username" });
    }
    if (result.password !== password) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    // create a jwt for user
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { username },
      "5687w7tfugyewtrf76%^&%$R^UY5&$%7697821689326192836",
      {
        expiresIn: "1h",
      }
    );
    return res.status(201).json({ token });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
