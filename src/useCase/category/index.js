import express from "express";
import CategoryController from "./category.controller.js";
const router = express.Router();
import decodedResponse from "../../middleware/decodedResponse.js";
import verification from "../../middleware/verification.js";

router.get("/", verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, CategoryController.all);

export default router