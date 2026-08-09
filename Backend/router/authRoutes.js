import express from "express";

import {
    registerUser,
    loginUser,
    getProfile,
} from "../controllers/authControl.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", (req, res, next) => {
    console.log("🔥 REGISTER ROUTE HIT");
    console.log("🔥 REQUEST BODY:", req.body);
    next();
}, registerUser);

router.post("/login", loginUser);

router.get("/profile", protect, getProfile);

export default router;