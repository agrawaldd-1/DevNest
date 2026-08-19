import { useState } from "react";
import { UserPlus, UserCheck, Clock } from "lucide-react";
import { sendConnectionRequest } from "../services/connectionService.js";

const ConnectButton = ({ userId, initialStatus = "connect", onStatusChange }) => {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        if (status !== "connect" || loading) return;

        try {
            setLoading(true);

            const response = await sendConnectionRequest(userId);

            if (response.success) {
                setStatus("pending");
                onStatusChange?.("pending");
            }
        } catch (error) {
            console.error("Connection request error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (status === "connected") {
        return (
            <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600"
            >
                <UserCheck size={17} />
                Connected
            </button>
        );
    }

    if (status === "pending") {
        return (
            <button
                type="button"
                disabled
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500"
            >
                <Clock size={17} />
                Request Sent
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={handleConnect}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <UserPlus size={17} />
            {loading ? "Sending..." : "Connect"}
        </button>
    );
};

export default ConnectButton;