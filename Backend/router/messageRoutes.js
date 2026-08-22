import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getAllMessages,
    sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/:targetId", protect, getAllMessages);

router.post("/:targetId", protect, sendMessage);

export default router;