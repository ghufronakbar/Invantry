import express from "express";
import TransactionController from "./transaction.controller.js";
import verification from "../../../middleware/verification.js";
const router = express.Router();

router.get('/', verification(["SUPER_ADMIN", "ADMIN"]), TransactionController.all)
router.get('/:id', verification(["SUPER_ADMIN", "ADMIN"]), TransactionController.byId)
router.post('/', verification(["SUPER_ADMIN"]), TransactionController.create)

export default router