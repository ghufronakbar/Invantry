import express from "express";
import ProductController from "./product.controller.js";
const router = express.Router();
import decodedResponse from "../../../middleware/decodedResponse.js";
import verification from "../../../middleware/verification.js";
import Cloudinary from "../../../utils/cloudinary.js";

router.get("/", verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, ProductController.all);
router.delete("/pictures", verification(["SUPER_ADMIN"]), decodedResponse, ProductController.deletePictures);
router.get("/:slug", verification(["SUPER_ADMIN", "ADMIN"]), decodedResponse, ProductController.bySlug);
router.post("/", verification(["SUPER_ADMIN"]), decodedResponse, ProductController.create);
router.put("/:slug", verification(["SUPER_ADMIN"]), decodedResponse, ProductController.edit);
router.patch("/:slug", verification(["SUPER_ADMIN"]), decodedResponse, Cloudinary.upload("product").array("pictures"), ProductController.postPictures);
router.delete("/:slug", verification(["SUPER_ADMIN"]), decodedResponse, ProductController.delete);

export default router