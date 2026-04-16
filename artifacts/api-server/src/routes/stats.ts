import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({
    shipmentsDelivered: 2847392,
    countriesServed: 152,
    clientsServed: 18400,
    onTimeDeliveryRate: 98.7,
  });
});

export default router;
