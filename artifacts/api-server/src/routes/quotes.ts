import { Router } from "express";
import { db } from "@workspace/db";
import { quotesTable } from "@workspace/db";
import { SubmitQuoteBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = SubmitQuoteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  const [quote] = await db
    .insert(quotesTable)
    .values({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      origin: data.origin,
      destination: data.destination,
      weight: data.weight != null ? String(data.weight) : null,
      serviceType: data.serviceType,
      notes: data.notes ?? null,
    })
    .returning();

  res.status(201).json({
    id: quote.id,
    name: quote.name,
    email: quote.email,
    phone: quote.phone ?? undefined,
    origin: quote.origin,
    destination: quote.destination,
    weight: quote.weight != null ? Number(quote.weight) : undefined,
    serviceType: quote.serviceType,
    notes: quote.notes ?? undefined,
    status: quote.status,
    createdAt: quote.createdAt.toISOString(),
  });
});

router.get("/", async (req, res) => {
  const quotes = await db.select().from(quotesTable).orderBy(quotesTable.createdAt);
  res.json(
    quotes.map((q) => ({
      id: q.id,
      name: q.name,
      email: q.email,
      phone: q.phone ?? undefined,
      origin: q.origin,
      destination: q.destination,
      weight: q.weight != null ? Number(q.weight) : undefined,
      serviceType: q.serviceType,
      notes: q.notes ?? undefined,
      status: q.status,
      createdAt: q.createdAt.toISOString(),
    }))
  );
});

export default router;
