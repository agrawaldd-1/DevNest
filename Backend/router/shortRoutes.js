import express from "express";

import {
    createShort,
    editShort,
    deleteShort,
    getAllShorts,
    viewShort,
} from "../controllers/shortsController.js";

import { protect } from "../middleware/authMiddleware.js";
import uploadShort from "../middleware/uploadShortsMiddleware.js";

const router = express.Router();

router.post(
    "/create",
    protect,
    uploadShort.single("video"),
    createShort
);

router.put(
    "/edit/:shortId",
    protect,
    editShort
);

router.delete(
    "/delete/:shortId",
    protect,
    deleteShort
);

router.get(
    "/",
    protect,
    getAllShorts
);

router.get(
    "/:shortId",
    protect,
    viewShort
);

export default router;