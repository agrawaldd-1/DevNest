import express from "express";
import { createPost, editPost , deletePost,getAllPosts,viewPost } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", protect, upload.single("image"), createPost);

router.put("/edit/:postId", protect, editPost);
router.delete("/delete/:postId", protect, deletePost);

router.get("/", protect, getAllPosts);
router.get("/:postId", protect, viewPost);

export default router;