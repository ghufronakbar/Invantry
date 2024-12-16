import express from "express";
import UserController from "./user.controller.js";
const router = express.Router();
import decodedResponse from "../../middleware/decodedResponse.js";
import verification from "../../middleware/verification.js";

router.get("/", verification(["SUPER_ADMIN"]), decodedResponse, UserController.all);
router.get("/:id", verification(["SUPER_ADMIN"]), decodedResponse, UserController.byId);
router.patch("/:id", verification(["SUPER_ADMIN"]), decodedResponse, UserController.setActive);

export default router