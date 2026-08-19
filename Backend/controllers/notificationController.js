import { Notification } from "../models/Notification.js";

export const createNotification = async ({
    sender,
    recipient,
    type,
    referenceId,
    referenceType
}) => {
    const notification = new Notification({
        sender,
        recipient,
        type,
        referenceId,
        referenceType
    });

    await notification.save();

    return notification;
};

export const getNotifications = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const notifications = await Notification.find({
            recipient: id,
            createdAt: { $gte: thirtyDaysAgo }
        })
            .populate("sender", "username image")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
        });
    } catch (error) {
        console.error("Get Notifications Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};