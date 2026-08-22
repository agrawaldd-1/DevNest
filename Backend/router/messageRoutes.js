import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getConversations,
    getAllMessages,
    sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/", protect, getConversations);

router.get("/:targetId", protect, getAllMessages);

router.post("/:targetId", protect, sendMessage);

export default router;