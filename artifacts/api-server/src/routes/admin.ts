import { Router } from "express";
import { sql, desc, eq, gte } from "drizzle-orm";
import {
  db,
  quotesTable,
  conversations,
  messages,
  shipmentsTable,
  pageViewsTable,
  type ShipmentEvent,
} from "@workspace/db";
import { adminAuth } from "../middlewares/admin-auth";

const router = Router();

router.use(adminAuth);

router.get("/me", (_req, res) => {
  res.json({ ok: true });
});

// ------- Quotes -------
router.get("/quotes", async (_req, res) => {
  const rows = await db.select().from(quotesTable).orderBy(desc(quotesTable.createdAt));
  res.json(rows);
});

router.patch("/quotes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { status } = req.body ?? {};
  if (typeof status !== "string") {
    res.status(400).json({ error: "status required" });
    return;
  }
  const [row] = await db
    .update(quotesTable)
    .set({ status })
    .where(eq(quotesTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.delete("/quotes/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(quotesTable).where(eq(quotesTable.id, id));
  res.status(204).end();
});

// ------- Conversations -------
router.get("/conversations", async (_req, res) => {
  const rows = await db
    .select({
      id: conversations.id,
      title: conversations.title,
      createdAt: conversations.createdAt,
      messageCount: sql<number>`count(${messages.id})::int`,
    })
    .from(conversations)
    .leftJoin(messages, eq(messages.conversationId, conversations.id))
    .groupBy(conversations.id)
    .orderBy(desc(conversations.createdAt));
  res.json(rows);
});

router.get("/conversations/:id/messages", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id))
    .orderBy(messages.createdAt);
  res.json(rows);
});

router.delete("/conversations/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(conversations).where(eq(conversations.id, id));
  res.status(204).end();
});

// ------- Shipments -------
router.get("/shipments", async (_req, res) => {
  const rows = await db.select().from(shipmentsTable).orderBy(desc(shipmentsTable.createdAt));
  res.json(rows);
});

router.post("/shipments", async (req, res) => {
  const { trackingNumber, status, origin, destination, estimatedDelivery, events } = req.body ?? {};
  if (
    typeof trackingNumber !== "string" ||
    typeof origin !== "string" ||
    typeof destination !== "string" ||
    typeof estimatedDelivery !== "string"
  ) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const [row] = await db
      .insert(shipmentsTable)
      .values({
        trackingNumber: trackingNumber.toUpperCase(),
        status: typeof status === "string" ? status : "Picked Up",
        origin,
        destination,
        estimatedDelivery,
        events: Array.isArray(events) ? (events as ShipmentEvent[]) : [],
      })
      .returning();
    res.status(201).json(row);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create";
    res.status(400).json({ error: message });
  }
});

router.patch("/shipments/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const { status, origin, destination, estimatedDelivery, events } = req.body ?? {};
  const updates: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof status === "string") updates["status"] = status;
  if (typeof origin === "string") updates["origin"] = origin;
  if (typeof destination === "string") updates["destination"] = destination;
  if (typeof estimatedDelivery === "string") updates["estimatedDelivery"] = estimatedDelivery;
  if (Array.isArray(events)) updates["events"] = events;
  const [row] = await db
    .update(shipmentsTable)
    .set(updates)
    .where(eq(shipmentsTable.id, id))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(row);
});

router.delete("/shipments/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(shipmentsTable).where(eq(shipmentsTable.id, id));
  res.status(204).end();
});

// ------- Analytics -------
router.get("/analytics", async (_req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [totals] = await db
    .select({
      total: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(distinct ${pageViewsTable.visitorId})::int`,
    })
    .from(pageViewsTable);

  const [last30] = await db
    .select({
      total: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(distinct ${pageViewsTable.visitorId})::int`,
    })
    .from(pageViewsTable)
    .where(gte(pageViewsTable.createdAt, since));

  const topPages = await db
    .select({
      path: pageViewsTable.path,
      views: sql<number>`count(*)::int`,
    })
    .from(pageViewsTable)
    .groupBy(pageViewsTable.path)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const topReferrers = await db
    .select({
      referrer: pageViewsTable.referrer,
      views: sql<number>`count(*)::int`,
    })
    .from(pageViewsTable)
    .groupBy(pageViewsTable.referrer)
    .orderBy(sql`count(*) desc`)
    .limit(10);

  const daily = await db
    .select({
      day: sql<string>`to_char(date_trunc('day', ${pageViewsTable.createdAt}), 'YYYY-MM-DD')`,
      views: sql<number>`count(*)::int`,
      uniqueVisitors: sql<number>`count(distinct ${pageViewsTable.visitorId})::int`,
    })
    .from(pageViewsTable)
    .where(gte(pageViewsTable.createdAt, since))
    .groupBy(sql`date_trunc('day', ${pageViewsTable.createdAt})`)
    .orderBy(sql`date_trunc('day', ${pageViewsTable.createdAt})`);

  const recent = await db
    .select()
    .from(pageViewsTable)
    .orderBy(desc(pageViewsTable.createdAt))
    .limit(50);

  const [quotesCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(quotesTable);
  const [convosCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(conversations);
  const [shipmentsCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(shipmentsTable);

  res.json({
    totals: {
      pageViews: totals?.total ?? 0,
      uniqueVisitors: totals?.uniqueVisitors ?? 0,
      pageViews30d: last30?.total ?? 0,
      uniqueVisitors30d: last30?.uniqueVisitors ?? 0,
      quotes: quotesCount?.n ?? 0,
      conversations: convosCount?.n ?? 0,
      shipments: shipmentsCount?.n ?? 0,
    },
    topPages,
    topReferrers,
    daily,
    recent,
  });
});

export default router;
