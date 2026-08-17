import { User } from "../models/user.js";
import { Connection } from "../models/connections.js";
import { createNotification } from "./notificationController.js";


export const sendConnectionRequest = async (req, res) => {
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
                message: "Target user id not found",
            });
        }

        if (id === targetId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a connection request to yourself",
            });
        }

        const targetUser = await User.findById(targetId);

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "Target user not found",
            });
        }

        const existingConnection = await Connection.findOne({
            $or: [
                {
                    requester: id, recipient: targetId,
                },
                {
                    requester: targetId, recipient: id,
                },
            ],
        });

        if (existingConnection) {
            if (existingConnection.status === "accepted") {
                return res.status(409).json({
                    success: false,
                    message: "You are already connected with this user",
                });
            }

            if (
                existingConnection.status === "pending" &&
                existingConnection.requester.toString() === id
            ) {
                return res.status(409).json({
                    success: false,
                    message: "Connection request already sent",
                });
            }

            if (
                existingConnection.status === "pending" &&
                existingConnection.recipient.toString() === id
            ) {
                return res.status(409).json({
                    success: false,
                    message: "This user has already sent you a connection request",
                });
            }

            if (existingConnection.status === "rejected") {
                await Connection.findByIdAndDelete(existingConnection._id);
            }
        }

        const sendConnection = await Connection.create({
            requester: id,
            recipient: targetId,
            status: "pending",
        });

        await createNotification({
            sender: id,
            recipient: targetId,
            type: "CONNECTION_REQUEST",
            referenceId: null,
            referenceType: null
        });

        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            sendConnection,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const acceptConnectionRequest = async (req, res) => {
    try {
        const { id } = req.user;
        const { connectionId } = req.params;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!connectionId) {
            return res.status(400).json({
                success: false,
                message: "Connection id not found",
            });
        }

        const existingConnection = await Connection.findOne({
            _id: connectionId,
            recipient: id,
            status: "pending",
        });

        if (!existingConnection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found",
            });
        }

        existingConnection.status = "accepted";
        await existingConnection.save();

        await createNotification({
            sender: id,
            recipient: existingConnection.requester,
            type: "CONNECTION_ACCEPTED",
            referenceId: null,
            referenceType: null
        });

        return res.status(200).json({
            success: true,
            message: "Connection request accepted",
            connection: existingConnection,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const rejectConnectionRequest = async (req, res) => {
    try {
        const { id } = req.user;
        const { connectionId } = req.params;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        if (!connectionId) {
            return res.status(400).json({
                success: false,
                message: "Connection id not found",
            });
        }

        const existingConnection = await Connection.findOne({
            _id: connectionId,
            recipient: id,
            status: "pending",
        });

        if (!existingConnection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found",
            });
        }

        existingConnection.status = "rejected";
        await existingConnection.save();

        return res.status(200).json({
            success: true,
            message: "Connection request rejected",
            connection: existingConnection,
        });
    }
    catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


export const getAllConnections = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const connections = await Connection.find({
            $or: [{ requester: id }, { recipient: id }],
            status: "accepted",
        })
            .populate("requester", "username image")
            .populate("recipient", "username image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: connections.length,
            connections,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};