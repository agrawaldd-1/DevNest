import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import {
    acceptConnectionRequest,
    rejectConnectionRequest,
} from "../services/connectionService.js";

const ConnectionRequests = ({ requests = [], onRequestHandled }) => {
    const [requestList, setRequestList] = useState(requests);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        setRequestList(requests);
    }, [requests]);

    const handleAccept = async (connectionId) => {
        try {
            setLoadingId(connectionId);

            const response = await acceptConnectionRequest(connectionId);

            if (response.success) {
                setRequestList((previous) =>
                    previous.filter((request) => request._id !== connectionId)
                );

                onRequestHandled?.();
            }
        } catch (error) {
            console.error("Accept connection error:", error);
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (connectionId) => {
        try {
            setLoadingId(connectionId);

            const response = await rejectConnectionRequest(connectionId);

            if (response.success) {
                setRequestList((previous) =>
                    previous.filter((request) => request._id !== connectionId)
                );

                onRequestHandled?.();
            }
        } catch (error) {
            console.error("Reject connection error:", error);
        } finally {
            setLoadingId(null);
        }
    };

    if (requestList.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-600">
                    No connection requests
                </p>

                <p className="mt-1 text-xs text-slate-400">
                    New requests will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {requestList.map((request) => {
                const requester = request.requester;
                const isLoading = loadingId === request._id;

                return (
                    <div
                        key={request._id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                    >
                        <div className="flex min-w-0 items-center gap-3">
                            {requester?.image ? (
                                <img
                                    src={requester.image}
                                    alt={requester.username}
                                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                                />
                            ) : (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-500">
                                    {requester?.username?.charAt(0)?.toUpperCase()}
                                </div>
                            )}

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {requester?.username}
                                </p>

                                <p className="text-xs text-slate-400">
                                    Wants to connect with you
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                            <button
                                type="button"
                                onClick={() => handleAccept(request._id)}
                                disabled={isLoading}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800 disabled:opacity-50"
                                aria-label="Accept connection request"
                            >
                                <Check size={17} />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleReject(request._id)}
                                disabled={isLoading}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-red-500 disabled:opacity-50"
                                aria-label="Reject connection request"
                            >
                                <X size={17} />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ConnectionRequests;