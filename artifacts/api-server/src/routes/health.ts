import { Router, type IRouter } from "express";

const router: IRouter = Router();

// GET /api/health
router.get("/", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
