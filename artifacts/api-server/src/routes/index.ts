import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quotesRouter from "./quotes";
import servicesRouter from "./services";
import trackingRouter from "./tracking";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/quotes", quotesRouter);
router.use("/services", servicesRouter);
router.use("/tracking", trackingRouter);
router.use("/stats", statsRouter);

export default router;
