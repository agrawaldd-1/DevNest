import { Post } from "../models/post.js";
import { Project } from "../models/project.js";
import { Like } from "../models/likes.js";

export const toggleLike = async (req, res) => {
    try {
        const { id } = req.user;
        const { targetId, targetType } = req.params;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!["post", "project"].includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid target type",
            });
        }

        const Model =
            targetType === "post"
                ? Post
                : Project;

        const targetModel =
            targetType === "post"
                ? "Post"
                : "Project";

        const target = await Model.findById(targetId);

        if (!target) {
            return res.status(404).json({
                success: false,
                message: `${
                    targetType === "post"
                        ? "Post"
                        : "Project"
                } not found`,
            });
        }

        const existingLike = await Like.findOne({
            user: id,
            target: targetId,
            targetModel,
        });

        let liked;

        if (existingLike) {
            await Like.findByIdAndDelete(
                existingLike._id
            );

            liked = false;
        } else {
            await Like.create({
                user: id,
                target: targetId,
                targetModel,
            });

            liked = true;
        }

        const likeCount = await Like.countDocuments({
            target: targetId,
            targetModel,
        });

        return res.status(200).json({
            success: true,
            liked,
            likeCount,
            message: liked
                ? "Liked successfully"
                : "Unliked successfully",
        });
    } catch (error) {
        console.error(
            "Toggle Like Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};