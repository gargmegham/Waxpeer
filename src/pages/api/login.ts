import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { signingKey } from "@/constants";

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
    const signup: boolean = req.body.signup;
    if (!signup) {
      const result: any = await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          username: true,
          password: true,
        },
      });
      if (!result) {
        return res.status(401).json({ error: "Incorrect username" });
      }
      if (result.password !== password) {
        return res.status(401).json({ error: "Incorrect password" });
      }
    } else {
      await prisma.user.create({
        data: {
          username,
          password,
        },
      });
      await prisma.settings.create({
        data: {
          userId: 1,
        },
      });
    }
    // create a jwt for user
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ username }, signingKey, {
      expiresIn: "6h",
    });
    return res.status(201).json({ token });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
