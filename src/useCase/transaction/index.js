import express from "express";
import TransactionController from "./transaction.controller.js";
import verification from "../../middleware/verification.js";
import decodedResponse from "../../middleware/decodedResponse.js";
const router = express.Router();

router.get('/', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, TransactionController.all)
router.get('/:id', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, TransactionController.byId)
router.post('/', verification(["SUPER_ADMIN"]), decodedResponse, TransactionController.create)

export default router