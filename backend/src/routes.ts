import express, { Router } from "express";

const router: Router = express.Router();

router.get("/health", (_req, res) => {
	res.json({ status: "ok" });
});

export default router;
