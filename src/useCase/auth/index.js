import express from "express";
import AuthController from "./auth.controller.js";

const router = express.Router();

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/refresh', AuthController.refresh)


export default router