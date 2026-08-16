import express from "express";
import {
    fetchProfile,
    editProfile,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, fetchProfile);
router.get("/:userId", protect, fetchProfile);

router.put(
    "/",
    protect,
    upload.single("image"),
    editProfile
);

export default router;