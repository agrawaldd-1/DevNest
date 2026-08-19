import { Post } from "../models/post.js";
import { Project } from "../models/project.js";
import { Short } from "../models/shorts.js";
import { Like } from "../models/likes.js";
import { createNotification } from "./notificationController.js";

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

        if (!["post", "project", "short"].includes(targetType)) {
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

        const target = await Model.findById(targetId);

        if (!target) {
            return res.status(404).json({
                success: false,
                message: `${targetName} not found`,
            });
        }

        const existingLike = await Like.findOne({
            user: id,
            target: targetId,
            targetModel,
        });

        let liked;

        if (existingLike) {
            await Like.findByIdAndDelete(existingLike._id);
            liked = false;
        } else {
            await Like.create({
                user: id,
                target: targetId,
                targetModel,
            });

            liked = true;

            let ownerId;

            if (targetType === "post") {
                ownerId = target.userId;
            } else {
                ownerId = target.userId;
            }

            if (ownerId && ownerId.toString() !== id.toString()) {
                try {
                    await createNotification({
                        sender: id,
                        recipient: ownerId,
                        type: "LIKE",
                        referenceId: targetId,
                        referenceType: targetModel,
                    });
                } catch (notificationError) {
                    console.error(
                        "Like notification error:",
                        notificationError
                    );
                }
            }
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
        console.error("Toggle Like Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};