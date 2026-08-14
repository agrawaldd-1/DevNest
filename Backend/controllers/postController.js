import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Like } from "../models/likes.js";
import { Comment } from "../models/comments.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createPost = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User Id is not given",
            });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const { caption } = req.body;

        if (!caption?.trim() && !req.file) {
            return res.status(400).json({
                success: false,
                message: "Post must contain a caption or image",
            });
        }

        let image = "";
        let imagePublicId = "";

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: "skillsync/posts",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                streamifier
                    .createReadStream(req.file.buffer)
                    .pipe(uploadStream);
            });

            image = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const post = await Post.create({
            userId: id,
            caption: caption?.trim() || "",
            image,
            imagePublicId,
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create post",
            error: error.message,
        });
    }
};

export const editPost = async (req, res) => {
    try {
        const { id } = req.user;
        const { postId } = req.params;
        const { caption } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User Id is not given",
            });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!caption?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Caption is required",
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.userId.toString() !== id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this post",
            });
        }

        post.caption = caption.trim();

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update post",
            error: error.message,
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.user;
        const { postId } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User Id is not given",
            });
        }

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        if (post.userId.toString() !== id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this post",
            });
        }

        if (post.imagePublicId) {
            await cloudinary.uploader.destroy(post.imagePublicId);
        }

        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete post",
            error: error.message,
        });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const userId = req.user.id;

        const totalPosts = await Post.countDocuments();

        const posts = await Post.find()
            .populate("userId", "username image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const postsWithEngagement = await Promise.all(
            posts.map(async (post) => {
                const likeCount = await Like.countDocuments({
                    target: post._id,
                    targetModel: "Post",
                });

                const commentCount =
                    await Comment.countDocuments({
                        target: post._id,
                        targetModel: "Post",
                    });

                const existingLike = await Like.findOne({
                    user: userId,
                    target: post._id,
                    targetModel: "Post",
                });

                return {
                    ...post.toObject(),
                    likeCount,
                    commentCount,
                    isLiked: Boolean(existingLike),
                };
            })
        );

        const totalPages = Math.ceil(
            totalPosts / limit
        );

        return res.status(200).json({
            success: true,
            count: postsWithEngagement.length,
            posts: postsWithEngagement,
            currentPage: page,
            totalPages,
            hasMore: page < totalPages,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const viewPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: "Post Id not found",
            });
        }

        const post = await Post.findById(postId)
            .populate("userId", "username image");

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const likeCount = await Like.countDocuments({
            target: postId,
            targetModel: "Post",
        });

        const commentCount = await Comment.countDocuments({
            target: postId,
            targetModel: "Post",
        });

        let isLiked = false;

        if (userId) {
            const existingLike = await Like.findOne({
                user: userId,
                target: postId,
                targetModel: "Post",
            });

            isLiked = Boolean(existingLike);
        }

        const postData = {
            ...post.toObject(),
            likeCount,
            commentCount,
            isLiked,
        };

        return res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            post: postData,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};