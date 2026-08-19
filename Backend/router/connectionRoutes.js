import express from "express";
import {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getAllConnections,
    getConnectionStatus
} from "../controllers/connectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request/:targetId", protect, sendConnectionRequest);
router.patch("/accept/:connectionId", protect, acceptConnectionRequest);
router.patch("/reject/:connectionId", protect, rejectConnectionRequest);
router.get("/", protect, getAllConnections);
router.get("/status/:targetId", protect, getConnectionStatus);
export default router;