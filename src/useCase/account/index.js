import express from "express";
import AccountController from "./account.controller.js";
import verification from "../../middleware/verification.js";
import decodedResponse from "../../middleware/decodedResponse.js";

const router = express.Router();

router.post('/login', AccountController.login)
router.post('/register', verification(["SUPER_ADMIN"]), decodedResponse, AccountController.register)
router.post('/refresh', AccountController.refresh)
router.get('/profile', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, AccountController.byDecoded)
router.put('/profile', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, AccountController.edit)


export default router