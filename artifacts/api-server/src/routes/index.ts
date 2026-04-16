import { Router, type IRouter } from "express";
import healthRouter from "./health";
import quotesRouter from "./quotes";
import servicesRouter from "./services";
import trackingRouter from "./tracking";
import statsRouter from "./stats";
import openaiRouter from "./openai/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/quotes", quotesRouter);
router.use("/services", servicesRouter);
router.use("/tracking", trackingRouter);
router.use("/stats", statsRouter);
router.use("/openai", openaiRouter);

export default router;
