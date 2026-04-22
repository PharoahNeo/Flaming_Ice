import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export type ShipmentEvent = {
  timestamp: string;
  location: string;
  description: string;
  status: string;
};

export const shipmentsTable = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  status: text("status").notNull().default("Picked Up"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  estimatedDelivery: text("estimated_delivery").notNull(),
  events: jsonb("events").$type<ShipmentEvent[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Shipment = typeof shipmentsTable.$inferSelect;
export type InsertShipment = typeof shipmentsTable.$inferInsert;
