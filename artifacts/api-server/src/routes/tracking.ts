import { Router } from "express";

const router = Router();

const TRACKING_DATA: Record<string, object> = {
  "SWR-2024-001": {
    trackingNumber: "SWR-2024-001",
    status: "In Transit",
    origin: "Los Angeles, CA",
    destination: "New York, NY",
    estimatedDelivery: "2026-04-18",
    events: [
      {
        timestamp: "2026-04-16T08:30:00Z",
        location: "Chicago, IL",
        description: "Package arrived at sorting facility",
        status: "In Transit",
      },
      {
        timestamp: "2026-04-15T22:10:00Z",
        location: "Denver, CO",
        description: "Departed distribution center",
        status: "In Transit",
      },
      {
        timestamp: "2026-04-15T10:00:00Z",
        location: "Los Angeles, CA",
        description: "Package picked up from sender",
        status: "Picked Up",
      },
    ],
  },
  "SWR-2024-002": {
    trackingNumber: "SWR-2024-002",
    status: "Delivered",
    origin: "Seattle, WA",
    destination: "Miami, FL",
    estimatedDelivery: "2026-04-14",
    events: [
      {
        timestamp: "2026-04-14T14:22:00Z",
        location: "Miami, FL",
        description: "Package delivered successfully",
        status: "Delivered",
      },
      {
        timestamp: "2026-04-14T09:00:00Z",
        location: "Miami, FL",
        description: "Out for delivery",
        status: "Out for Delivery",
      },
      {
        timestamp: "2026-04-13T18:30:00Z",
        location: "Atlanta, GA",
        description: "Arrived at distribution hub",
        status: "In Transit",
      },
      {
        timestamp: "2026-04-12T07:00:00Z",
        location: "Seattle, WA",
        description: "Package picked up",
        status: "Picked Up",
      },
    ],
  },
};

router.get("/:trackingNumber", (req, res) => {
  const { trackingNumber } = req.params;
  const result = TRACKING_DATA[trackingNumber.toUpperCase()];
  if (!result) {
    res.status(404).json({ error: "Shipment not found" });
    return;
  }
  res.json(result);
});

export default router;
