import express from "express";
import AccountController from "./account.controller.js";
import verification from "../../middleware/verification.js";
import decodedResponse from "../../middleware/decodedResponse.js";
import Cloudinary from "../../utils/cloudinary.js";

const router = express.Router();

router.post('/login', AccountController.login)
router.post('/register', verification(["SUPER_ADMIN"]), decodedResponse, AccountController.register)
router.post('/refresh', AccountController.refresh)
router.get('/profile', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, AccountController.byDecoded)
router.put('/profile', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, AccountController.edit)
router.patch('/profile', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, Cloudinary.upload("profile").single("picture"), AccountController.editPicture)
router.delete('/profile', verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, AccountController.deletePicture)
router.get('/confirm/:token', AccountController.confirm)


export default router