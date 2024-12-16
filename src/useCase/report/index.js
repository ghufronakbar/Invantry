import express from "express";
import ReportController from "./report.controller.js";
const router = express.Router();

router.get("/annual", ReportController.annually);
router.get("/this-month", ReportController.thisMonth);
router.get("/product/:id", ReportController.byProductId);

export default router