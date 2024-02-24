import { mainBot } from "@/bot/index";

export default function handler(req, res) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).end("Unauthorized");
  }
  try {
    mainBot();
  } catch (err) {
    console.error(err);
  } finally {
    res
      .status(200)
      .json({ status: true, message: "Cron job ran successfully" });
  }
}
