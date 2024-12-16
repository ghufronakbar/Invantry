import express from "express";
import AuthController from "./auth.controller.js";
import verification from "../../middleware/verification.js";
import decodedResponse from "../../middleware/decodedResponse.js";

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/register', verification(["SUPER_ADMIN"]), decodedResponse, AuthController.register)
router.post('/refresh', AuthController.refresh)


export default router