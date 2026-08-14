import { Post } from "../models/post.js";
import { Project } from "../models/project.js";
import { Short } from "../models/shorts.js";
import { Comment } from "../models/comments.js";

export const addComment = async (req, res) => {
    try {
        const { id } = req.user;
        const { targetId, targetType } = req.params;
        const { content } = req.body;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot be empty",
            });
        }

        if (
            !["post", "project", "short"].includes(
                targetType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid target type",
            });
        }

        let Model;
        let targetModel;
        let targetName;

        if (targetType === "post") {
            Model = Post;
            targetModel = "Post";
            targetName = "Post";
        } else if (targetType === "project") {
            Model = Project;
            targetModel = "Project";
            targetName = "Project";
        } else {
            Model = Short;
            targetModel = "Short";
            targetName = "Short";
        }

        const target = await Model.findById(
            targetId
        );

        if (!target) {
            return res.status(404).json({
                success: false,
                message: `${targetName} not found`,
            });
        }

        const comment = await Comment.create({
            user: id,
            target: targetId,
            targetModel,
            content: content.trim(),
        });

        const populatedComment =
            await Comment.findById(comment._id)
                .populate(
                    "user",
                    "username image"
                );

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment,
        });
    } catch (error) {
        console.error(
            "Add Comment Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const { targetId, targetType } =
            req.params;

        if (
            !["post", "project", "short"].includes(
                targetType
            )
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid target type",
            });
        }

        let targetModel;

        if (targetType === "post") {
            targetModel = "Post";
        } else if (targetType === "project") {
            targetModel = "Project";
        } else {
            targetModel = "Short";
        }

        const comments = await Comment.find({
            target: targetId,
            targetModel,
        })
            .populate(
                "user",
                "username image"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: comments.length,
            comments,
        });
    } catch (error) {
        console.error(
            "Get Comments Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};