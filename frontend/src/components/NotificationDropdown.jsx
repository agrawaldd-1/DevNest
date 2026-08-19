import { Bell, Check, Heart, MessageCircle, UserCheck, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications } from "../services/notificationService.js";
import { acceptConnectionRequest, rejectConnectionRequest } from "../services/connectionService.js";

const NotificationDropdown = ({ open, onClose }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!open) return;

        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const response = await getNotifications();

                if (response.success) {
                    setNotifications(response.notifications || []);
                }
            } catch (error) {
                console.error("Notification fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [open]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (open) document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open, onClose]);

    const getNotificationMessage = (notification) => {
        const username = notification?.sender?.username || "Someone";

        switch (notification.type) {
            case "LIKE":
                return `${username} liked your ${notification.referenceType?.toLowerCase() || "post"}.`;
            case "COMMENT":
                return `${username} commented on your ${notification.referenceType?.toLowerCase() || "post"}.`;
            case "CONNECTION_REQUEST":
                return `${username} sent you a connection request.`;
            case "CONNECTION_ACCEPTED":
                return `You accepted ${username}'s connection request.`;
            case "CONNECTION_REJECTED":
                return `You rejected ${username}'s connection request.`;
            default:
                return `${username} interacted with you.`;
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "LIKE":
                return <Heart size={15} />;
            case "COMMENT":
                return <MessageCircle size={15} />;
            case "CONNECTION_REQUEST":
                return <UserPlus size={15} />;
            case "CONNECTION_ACCEPTED":
                return <UserCheck size={15} />;
            case "CONNECTION_REJECTED":
                return <X size={15} />;
            default:
                return <Bell size={15} />;
        }
    };

    const formatTime = (date) => {
        if (!date) return "";

        const createdAt = new Date(date);
        const difference = Math.floor((Date.now() - createdAt.getTime()) / 1000);

        if (difference < 60) return "Just now";

        const minutes = Math.floor(difference / 60);
        if (minutes < 60) return `${minutes}m`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;

        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d`;

        return createdAt.toLocaleDateString();
    };

    const handleConnectionAction = async (notification, action) => {
        const connectionId = notification?.referenceId;

        if (!connectionId) {
            console.error("Connection ID is missing");
            return;
        }

        try {
            setActionLoading(notification._id);

            const response = action === "accept"
                ? await acceptConnectionRequest(connectionId)
                : await rejectConnectionRequest(connectionId);

            if (response.success) {
                setNotifications((previous) => previous.map((item) => {
                    if (item._id !== notification._id) return item;

                    return {
                        ...item,
                        type: action === "accept" ? "CONNECTION_ACCEPTED" : "CONNECTION_REJECTED",
                    };
                }));
            }
        } catch (error) {
            console.error("Connection action error:", error);
            console.error("Backend response:", error?.response?.data);
        } finally {
            setActionLoading(null);
        }
    };

    const handleNotificationClick = (notification) => {
        if (notification.type === "CONNECTION_REQUEST") return;

        onClose();

        if (notification.type === "CONNECTION_ACCEPTED" || notification.type === "CONNECTION_REJECTED") {
            if (notification.sender?._id) navigate(`/profile/${notification.sender._id}`);
            return;
        }

        if (notification.referenceId && notification.referenceType === "Post") {
            navigate(`/posts/${notification.referenceId}`);
            return;
        }

        if (notification.referenceId && notification.referenceType === "Project") {
            navigate(`/projects/${notification.referenceId}`);
            return;
        }

        if (notification.referenceId && notification.referenceType === "Short") {
            navigate(`/shorts/${notification.referenceId}`);
        }
    };

    if (!open) return null;

    return (
        <div ref={dropdownRef} className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">Notifications</h2>
                    <p className="text-xs text-slate-400">Your latest activity</p>
                </div>
                <span className="text-xs text-slate-400">{notifications.length}</span>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
                {loading ? (
                    <div className="px-4 py-10 text-center text-sm text-slate-400">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="px-4 py-12 text-center">
                        <Bell className="mx-auto mb-3 text-slate-300" size={28} />
                        <p className="text-sm font-medium text-slate-600">No notifications</p>
                        <p className="mt-1 text-xs text-slate-400">You are all caught up.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification._id} className="border-b border-slate-100 px-4 py-3 transition hover:bg-slate-50">
                            <div className="flex items-start gap-3">
                                <button type="button" onClick={() => handleNotificationClick(notification)} className="relative shrink-0">
                                    {notification.sender?.image ? (
                                        <img src={notification.sender.image} alt={notification.sender.username} className="h-10 w-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                    )}

                                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-600 shadow">
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                </button>

                                <button type="button" onClick={() => handleNotificationClick(notification)} className="min-w-0 flex-1 text-left">
                                    <p className="text-sm leading-5 text-slate-700">{getNotificationMessage(notification)}</p>
                                    <p className="mt-1 text-[11px] text-slate-400">{formatTime(notification.createdAt)}</p>
                                </button>

                                {notification.type === "CONNECTION_REQUEST" && (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            disabled={actionLoading === notification._id}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleConnectionAction(notification, "accept");
                                            }}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 disabled:opacity-50"
                                        >
                                            <Check size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            disabled={actionLoading === notification._id}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleConnectionAction(notification, "reject");
                                            }}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <X size={17} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {notifications.length > 0 && (
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        navigate("/notifications");
                    }}
                    className="w-full border-t border-slate-100 px-4 py-3 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                    View all notifications
                </button>
            )}
        </div>
    );
};

export default NotificationDropdown;