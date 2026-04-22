import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, shipmentsTable } from "@workspace/db";

const router = Router();

router.get("/:trackingNumber", async (req, res) => {
  const tn = req.params.trackingNumber.toUpperCase();
  const [row] = await db
    .select()
    .from(shipmentsTable)
    .where(eq(shipmentsTable.trackingNumber, tn))
    .limit(1);
  if (!row) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  res.json({
    trackingNumber: row.trackingNumber,
    status: row.status,
    origin: row.origin,
    destination: row.destination,
    estimatedDelivery: row.estimatedDelivery,
    events: row.events ?? [],
  });
});

export default router;
