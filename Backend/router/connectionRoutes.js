import express from "express";
import {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getAllConnections
} from "../controllers/connectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/request/:targetId", protect, sendConnectionRequest);
router.patch("/accept/:connectionId", protect, acceptConnectionRequest);
router.patch("/reject/:connectionId", protect, rejectConnectionRequest);
router.get("/", protect, getAllConnections);

export default router;