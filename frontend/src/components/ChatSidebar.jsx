import { useEffect, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { searchBar } from "../services/searchService.js";

const ChatSidebar = ({ conversations, conversationsLoading, onSelectUser }) => {
    const [query, setQuery] = useState("");
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const searchUsers = async () => {
            if (!query.trim()) {
                setDevelopers([]);
                return;
            }

            try {
                setLoading(true);

                const response = await searchBar(query.trim());

                if (response.success && response.type === "developer") {
                    setDevelopers(response.developers || []);
                } else {
                    setDevelopers([]);
                }
            } catch (error) {
                setDevelopers([]);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(searchUsers, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const getInitial = (username) => {
        return username?.charAt(0)?.toUpperCase() || "?";
    };

    const renderAvatar = (user, size = "h-12 w-12") => {
        return (
            <div
                className={`flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-semibold text-white`}
            >
                {user?.image ? (
                    <img
                        src={user.image}
                        alt={user.username}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    getInitial(user?.username)
                )}
            </div>
        );
    };

    return (
        <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white lg:w-[425px] lg:shrink-0">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6 sm:py-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20 sm:h-13 sm:w-13">
                        <MessageCircle size={26} className="text-white" />
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold text-slate-900">
                            Messages
                        </h1>

                        <p className="text-sm text-slate-400">
                            Search people and chat
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <Search
                        size={21}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search people"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white sm:py-4"
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
                {query.trim() ? (
                    <>
                        <div className="px-5 pt-5 sm:px-6">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                People
                            </p>
                        </div>

                        {loading ? (
                            <div className="py-10 text-center text-sm text-slate-400">
                                Searching...
                            </div>
                        ) : developers.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                    <Search
                                        size={24}
                                        className="text-slate-400"
                                    />
                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-600">
                                    No users found
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Try another name or username.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-3 px-3 pb-4">
                                {developers.map((developer) => (
                                    <button
                                        key={developer._id}
                                        type="button"
                                        onClick={() => onSelectUser(developer)}
                                        className="flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50"
                                    >
                                        {renderAvatar(developer)}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {developer.username}
                                            </p>

                                            <p className="truncate text-xs text-slate-400">
                                                Start a conversation
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {conversationsLoading ? (
                            <div className="py-10 text-center text-sm text-slate-400">
                                Loading conversations...
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="px-6 py-20 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                    <MessageCircle
                                        size={25}
                                        className="text-slate-400"
                                    />
                                </div>

                                <p className="mt-4 text-sm font-medium text-slate-600">
                                    No conversations yet
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Search for a developer and start chatting.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-3 px-3 pb-4">
                                <div className="px-3 py-2">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Conversations
                                    </p>
                                </div>

                                {conversations.map((conversation) => (
                                    <button
                                        key={conversation.user._id}
                                        type="button"
                                        onClick={() =>
                                            onSelectUser(conversation.user)
                                        }
                                        className="flex w-full items-center gap-4 rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50"
                                    >
                                        {renderAvatar(conversation.user)}

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {conversation.user.username}
                                                </p>

                                                <p className="shrink-0 text-[11px] text-slate-400">
                                                    {conversation.time}
                                                </p>
                                            </div>

                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                {conversation.lastMessage}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};

export default ChatSidebar;