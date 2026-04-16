import { Router } from "express";

const router = Router();

const SERVICES = [
  {
    id: 1,
    name: "Standard Freight",
    description: "Reliable ground freight solutions for domestic shipments across all 50 states. Cost-effective with full tracking visibility.",
    icon: "truck",
    features: ["Full tracking", "Door-to-door delivery", "Signature confirmation", "Insurance included"],
    estimatedDays: "3-7 business days",
    startingPrice: 49.99,
  },
  {
    id: 2,
    name: "Express Delivery",
    description: "When time is critical. Our express service guarantees next-day and 2-day delivery windows with priority handling.",
    icon: "zap",
    features: ["Priority handling", "Guaranteed delivery windows", "Real-time alerts", "Dedicated support"],
    estimatedDays: "1-2 business days",
    startingPrice: 99.99,
  },
  {
    id: 3,
    name: "Air Freight",
    description: "Fastest international and domestic shipping via our air cargo network. Ideal for time-sensitive, high-value shipments.",
    icon: "plane",
    features: ["24/7 global network", "Climate-controlled options", "Customs handling", "Priority boarding"],
    estimatedDays: "1-3 business days",
    startingPrice: 199.99,
  },
  {
    id: 4,
    name: "International Shipping",
    description: "End-to-end international logistics covering 150+ countries. Full customs documentation and compliance handled for you.",
    icon: "globe",
    features: ["150+ countries", "Customs brokerage", "Multi-currency invoicing", "Duty/tax optimization"],
    estimatedDays: "5-14 business days",
    startingPrice: 149.99,
  },
];

router.get("/", (req, res) => {
  res.json(SERVICES);
});

export default router;
