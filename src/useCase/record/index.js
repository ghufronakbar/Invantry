import express from "express";
import RecordController from "./record.controller.js";
const router = express.Router();
import decodedResponse from "../../middleware/decodedResponse.js";
import verification from "../../middleware/verification.js";

router.get("/", verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, RecordController.all);
router.get("/:id", verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, RecordController.byId);

export default router