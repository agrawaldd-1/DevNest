import { getRoomId } from "../utils/roomId.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

export const searchUsers = async (req, res) => {
    try {
        const { id } = req.user;
        const { query } = req.query;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!query || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const searchRegex = new RegExp(query.trim(), "i");

        const users = await User.find({
            _id: {
                $ne: id,
            },
            $or: [
                {
                    username: searchRegex,
                },
                {
                    email: searchRegex,
                },
            ],
        })
            .select("_id username email profilePhoto")
            .limit(20);

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        console.error("Search Users Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const messages = await Message.find({
            $or: [
                {
                    sender: id,
                },
                {
                    roomId: {
                        $regex: id.toString(),
                    },
                },
            ],
        })
            .sort({
                createdAt: -1,
            })
            .populate("sender", "_id username email image");

        const conversations = [];
        const conversationIds = new Set();

        for (const message of messages) {
            const roomUsers = message.roomId.split("@");

            const otherUserId =
                roomUsers[0] === id.toString()
                    ? roomUsers[1]
                    : roomUsers[0];

            if (!otherUserId || conversationIds.has(otherUserId)) {
                continue;
            }

            conversationIds.add(otherUserId);

            let otherUser = null;

            if (
                message.sender &&
                message.sender._id.toString() === otherUserId
            ) {
                otherUser = message.sender;
            } else {
                otherUser = await User.findById(otherUserId)
                    .select("_id username email image");
            }

            if (!otherUser) {
                continue;
            }

            conversations.push({
                user: otherUser,
                lastMessage: message.message,
                time: new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });
        }

        return res.status(200).json({
            success: true,
            message: "Conversations fetched successfully",
            conversations,
        });
    } catch (error) {
        console.error("Get Conversations Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllMessages = async (req, res) => {
    try {
        const { id } = req.user;
        const { targetId } = req.params;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!targetId) {
            return res.status(400).json({
                success: false,
                message: "User ID is not given",
            });
        }

        const roomId = getRoomId(id, targetId);

        const messages = await Message.find({
            roomId,
        }).sort({
            createdAt: 1,
        });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            messages,
        });
    } catch (error) {
        console.error("Get Messages Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.user;
        const { targetId } = req.params;
        const { text } = req.body;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!targetId) {
            return res.status(400).json({
                success: false,
                message: "User ID is not given",
            });
        }

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message not provided",
            });
        }

        const roomId = getRoomId(id, targetId);

        const newMessage = await Message.create({
            roomId,
            sender: id,
            message: text.trim(),
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            newMessage,
        });
    } catch (error) {
        console.error("Send Message Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};