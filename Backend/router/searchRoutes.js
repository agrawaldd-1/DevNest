import express from "express";
import { searchBar } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, searchBar);

export default router;