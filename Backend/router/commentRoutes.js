import express from "express";

import {
    addComment,
    getComments,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/:targetType/:targetId/comments",
    protect,
    addComment
);

router.get(
    "/:targetType/:targetId/comments",
    getComments
);

export default router;