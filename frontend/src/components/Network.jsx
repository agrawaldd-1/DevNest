import { useEffect, useState } from "react";
import { Search, Users, X } from "lucide-react";
import { getAllConnections } from "../services/connectionService.js";

const Network = ({ onClose }) => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await getAllConnections();

                if (response.success) {
                    setConnections(response.connections || []);
                }
            } catch (error) {
                console.error("Connections fetch error:", error);
                setError("Unable to load your connections.");
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    const getOtherUser = (connection) => {
        const currentUserId = localStorage.getItem("userId");
        const requesterId = connection.requester?._id?.toString();

        return requesterId === currentUserId ? connection.recipient : connection.requester;
    };

    const filteredConnections = connections.filter((connection) => {
        const user = getOtherUser(connection);
        return user?.username?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]" onClick={onClose}>
            <div className="flex max-h-[80vh] w-full max-w-[520px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-violet-600" />
                        <h2 className="text-lg font-bold text-slate-900">Network</h2>
                    </div>

                    <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <X size={20} />
                    </button>
                </div>

                <div className="border-b border-slate-100 px-5 py-3">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2.5">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                    </div>
                </div>

                <div className="overflow-y-auto px-3 py-2">
                    {loading ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-slate-400">Loading connections...</p>
                        </div>
                    ) : error ? (
                        <div className="py-12 text-center">
                            <p className="text-sm text-red-500">{error}</p>
                        </div>
                    ) : filteredConnections.length === 0 ? (
                        <div className="py-12 text-center">
                            <Users className="mx-auto mb-3 text-slate-300" size={32} />
                            <p className="text-sm font-semibold text-slate-600">
                                {search ? "No connection found" : "No connections yet"}
                            </p>
                            {!search && <p className="mt-1 text-xs text-slate-400">Start connecting with other developers.</p>}
                        </div>
                    ) : (
                        filteredConnections.map((connection) => {
                            const user = getOtherUser(connection);

                            if (!user) return null;

                            return (
                                <div key={connection._id} className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-slate-50">
                                    <div className="flex min-w-0 items-center gap-3">
                                        {user.image ? (
                                            <img src={user.image} alt={user.username} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                                        ) : (
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-600">
                                                {user.username?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-900">{user.username}</p>
                                            <p className="text-xs text-slate-400">Connected</p>
                                        </div>
                                    </div>

                                    <span className="ml-3 shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                                        Connected
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default Network;