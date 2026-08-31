import { User } from "../models/user.js";
import { Connection } from "../models/connections.js";
import { Notification } from "../models/notification.js";
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

        if (id.toString() === targetId.toString()) {
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
                { requester: id, recipient: targetId },
                { requester: targetId, recipient: id },
            ],
        });

        if (existingConnection) {
            if (existingConnection.status === "accepted") {
                return res.status(409).json({
                    success: false,
                    message: "You are already connected with this user",
                });
            }

            if (existingConnection.status === "pending" && existingConnection.requester.toString() === id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Connection request already sent",
                });
            }

            if (existingConnection.status === "pending" && existingConnection.recipient.toString() === id.toString()) {
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
            referenceId: sendConnection._id,
            referenceType: "Connection",
        });

        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            sendConnection,
        });
    } catch (error) {
        console.error("Send Connection Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
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

        await Notification.findOneAndUpdate(
            {
                recipient: id,
                referenceId: existingConnection._id,
                type: "CONNECTION_REQUEST",
            },
            {
                type: "CONNECTION_ACCEPTED",
            }
        );

        await createNotification({
            sender: id,
            recipient: existingConnection.requester,
            type: "CONNECTION_ACCEPTED",
            referenceId: existingConnection._id,
            referenceType: "Connection",
        });

        return res.status(200).json({
            success: true,
            message: "Connection request accepted",
            connection: existingConnection,
        });
    } catch (error) {
        console.error("Accept Connection Error:", error);

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

        await Notification.findOneAndDelete({
            recipient: id,
            referenceId: existingConnection._id,
            type: "CONNECTION_REQUEST",
        });

        return res.status(200).json({
            success: true,
            message: "Connection request rejected",
            connection: existingConnection,
        });
    } catch (error) {
        console.error("Reject Connection Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

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
            $or: [
                { requester: id },
                { recipient: id },
            ],
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
        console.error("Get Connections Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getConnectionStatus = async (req, res) => {
    try {
        const { id } = req.user;
        const { targetId } = req.params;

        if (id.toString() === targetId.toString()) {
            return res.status(200).json({
                success: true,
                status: "self",
            });
        }

        const connection = await Connection.findOne({
            $or: [
                { requester: id, recipient: targetId },
                { requester: targetId, recipient: id },
            ],
        });

        if (!connection) {
            return res.status(200).json({
                success: true,
                status: "connect",
            });
        }

        if (connection.status === "accepted") {
            return res.status(200).json({
                success: true,
                status: "connected",
            });
        }

        if (connection.status === "pending") {
            const isRequester = connection.requester.toString() === id.toString();

            return res.status(200).json({
                success: true,
                status: isRequester ? "pending" : "received",
                connectionId: connection._id,
            });
        }

        return res.status(200).json({
            success: true,
            status: "connect",
        });
    } catch (error) {
        console.error("Get Connection Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};