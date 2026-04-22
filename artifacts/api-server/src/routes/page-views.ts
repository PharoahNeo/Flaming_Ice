import { Router } from "express";
import crypto from "node:crypto";
import { db, pageViewsTable } from "@workspace/db";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { path, referrer, visitorId } = req.body ?? {};
    if (typeof path !== "string" || typeof visitorId !== "string") {
      res.status(400).json({ error: "path and visitorId required" });
      return;
    }
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    const ipHash = ip
      ? crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16)
      : null;
    await db.insert(pageViewsTable).values({
      path: path.slice(0, 500),
      referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
      userAgent: (req.headers["user-agent"] ?? "").toString().slice(0, 500) || null,
      visitorId: visitorId.slice(0, 100),
      ipHash,
    });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to record view" });
  }
});

export default router;
