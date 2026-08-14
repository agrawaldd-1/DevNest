import { User } from "../models/user.js";
import { Short } from "../models/shorts.js";
import { Like } from "../models/likes.js";
import { Comment } from "../models/comments.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const createShort = async (req, res) => {
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

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Short video is required",
            });
        }

        const uploadResult = await new Promise(
            (resolve, reject) => {
                const uploadStream =
                    cloudinary.uploader.upload_stream(
                        {
                            folder: "skillsync/shorts",
                            resource_type: "video",
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
            }
        );

        const short = await Short.create({
            userId: id,
            caption: caption?.trim() || "",
            video: uploadResult.secure_url,
            videoPublicId: uploadResult.public_id,
        });

        return res.status(201).json({
            success: true,
            message: "Short created successfully",
            short,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create short",
            error: error.message,
        });
    }
};

export const editShort = async (req, res) => {
    try {
        const { id } = req.user;
        const { shortId } = req.params;
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

        const short = await Short.findById(shortId);

        if (!short) {
            return res.status(404).json({
                success: false,
                message: "Short not found",
            });
        }

        if (
            short.userId.toString() !==
            id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to edit this short",
            });
        }

        short.caption = caption?.trim() || "";

        await short.save();

        return res.status(200).json({
            success: true,
            message: "Short updated successfully",
            short,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update short",
            error: error.message,
        });
    }
};

export const deleteShort = async (req, res) => {
    try {
        const { id } = req.user;
        const { shortId } = req.params;

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

        const short = await Short.findById(shortId);

        if (!short) {
            return res.status(404).json({
                success: false,
                message: "Short not found",
            });
        }

        if (
            short.userId.toString() !==
            id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not authorized to delete this short",
            });
        }

        if (short.videoPublicId) {
            await cloudinary.uploader.destroy(
                short.videoPublicId,
                {
                    resource_type: "video",
                }
            );
        }

        await Short.findByIdAndDelete(shortId);

        return res.status(200).json({
            success: true,
            message: "Short deleted successfully",
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete short",
            error: error.message,
        });
    }
};

export const getAllShorts = async (req, res) => {
    try {
        const userId = req.user.id;

        const shorts = await Short.find()
            .populate(
                "userId",
                "username image"
            )
            .sort({ createdAt: -1 });

        const shortsWithEngagement =
            await Promise.all(
                shorts.map(async (short) => {
                    const likeCount =
                        await Like.countDocuments({
                            target: short._id,
                            targetModel: "Short",
                        });

                    const commentCount =
                        await Comment.countDocuments({
                            target: short._id,
                            targetModel: "Short",
                        });

                    const existingLike =
                        await Like.findOne({
                            user: userId,
                            target: short._id,
                            targetModel: "Short",
                        });

                    return {
                        ...short.toObject(),
                        likeCount,
                        commentCount,
                        isLiked: Boolean(existingLike),
                    };
                })
            );

        return res.status(200).json({
            success: true,
            count: shortsWithEngagement.length,
            shorts: shortsWithEngagement,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
};

export const viewShort = async (req, res) => {
    try {
        const { shortId } = req.params;
        const userId = req.user?.id;

        if (!shortId) {
            return res.status(400).json({
                success: false,
                message: "Short Id not found",
            });
        }

        const short = await Short.findById(shortId)
            .populate(
                "userId",
                "username image"
            );

        if (!short) {
            return res.status(404).json({
                success: false,
                message: "Short not found",
            });
        }

        const likeCount =
            await Like.countDocuments({
                target: shortId,
                targetModel: "Short",
            });

        const commentCount =
            await Comment.countDocuments({
                target: shortId,
                targetModel: "Short",
            });

        let isLiked = false;

        if (userId) {
            const existingLike =
                await Like.findOne({
                    user: userId,
                    target: shortId,
                    targetModel: "Short",
                });

            isLiked = Boolean(existingLike);
        }

        const shortData = {
            ...short.toObject(),
            likeCount,
            commentCount,
            isLiked,
        };

        return res.status(200).json({
            success: true,
            message: "Short fetched successfully",
            short: shortData,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};