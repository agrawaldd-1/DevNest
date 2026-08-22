import { getRoomId } from "../utils/roomId.js";
import { Message } from "../models/message.js";

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