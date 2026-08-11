import express from "express";
import { fetchProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, fetchProfile);

export default router;