import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, MoreVertical, Send } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getProfile } from "../services/authServices.js";
import {
    getAllMessages,
    getConversations,
} from "../services/messageService.js";

import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";
import ChatSidebar from "./ChatSidebar.jsx";

import {
    connectSocket,
    disconnectSocket,
} from "./socket/socket.js";

const Chat = () => {
    const navigate = useNavigate();
    const { targetId } = useParams();

    const [user, setUser] = useState(null);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                const response = await getProfile(token);

                if (response.success) {
                    setUser(response.user);
                }
            } catch (error) {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const fetchConversations = async () => {
        try {
            setConversationsLoading(true);

            const response = await getConversations();

            if (response.success) {
                setConversations(response.conversations || []);
            } else {
                setConversations([]);
            }
        } catch (error) {
            console.error("Get Conversations Error:", error);
            setConversations([]);
        } finally {
            setConversationsLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        const connectedSocket = connectSocket();

        if (!connectedSocket) {
            return;
        }

        setSocket(connectedSocket);

        return () => {
            connectedSocket.off("messageReceived");
            disconnectSocket();
        };
    }, []);

    useEffect(() => {
        if (!targetId) {
            setActiveUser(null);
            setMessages([]);
            return;
        }

        const conversation = conversations.find(
            (item) => item.user?._id?.toString() === targetId.toString()
        );

        if (conversation) {
            setActiveUser(conversation.user);
        }
    }, [targetId, conversations]);

    useEffect(() => {
        if (!targetId) {
            return;
        }

        const fetchMessages = async () => {
            try {
                setMessagesLoading(true);

                const response = await getAllMessages(targetId);

                if (response.success) {
                    setMessages(response.messages || []);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Get Messages Error:", error);
                setMessages([]);
            } finally {
                setMessagesLoading(false);
            }
        };

        fetchMessages();
    }, [targetId]);

    useEffect(() => {
        if (!socket || !targetId) {
            return;
        }

        socket.emit("joinChat", {
            otherUserId: targetId,
        });

        const handleMessageReceived = (message) => {
            const senderId =
                typeof message.sender === "object"
                    ? message.sender?._id?.toString()
                    : message.sender?.toString();

            const currentUserId = user?._id?.toString();
            const currentTargetId = targetId?.toString();

            if (
                senderId === currentTargetId ||
                senderId === currentUserId
            ) {
                setMessages((previousMessages) => {
                    const alreadyExists = previousMessages.some(
                        (item) => item._id === message._id
                    );

                    if (alreadyExists) {
                        return previousMessages;
                    }

                    return [...previousMessages, message];
                });
            }

            const messageTime = new Date(
                message.createdAt || Date.now()
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });

            setConversations((previousConversations) => {
                const conversationExists = previousConversations.some(
                    (conversation) =>
                        conversation.user?._id?.toString() ===
                        currentTargetId
                );

                if (conversationExists) {
                    return previousConversations
                        .map((conversation) => {
                            if (
                                conversation.user?._id?.toString() ===
                                currentTargetId
                            ) {
                                return {
                                    ...conversation,
                                    lastMessage: message.message,
                                    time: messageTime,
                                };
                            }

                            return conversation;
                        })
                        .sort(
                            (a, b) =>
                                new Date(b.updatedAt || 0) -
                                new Date(a.updatedAt || 0)
                        );
                }

                if (activeUser) {
                    return [
                        {
                            user: activeUser,
                            lastMessage: message.message,
                            time: messageTime,
                            updatedAt:
                                message.createdAt || new Date().toISOString(),
                        },
                        ...previousConversations,
                    ];
                }

                return previousConversations;
            });
        };

        socket.on("messageReceived", handleMessageReceived);

        return () => {
            socket.off("messageReceived", handleMessageReceived);
        };
    }, [socket, targetId, user, activeUser]);

    const handleSendMessage = (event) => {
        event.preventDefault();

        const trimmedText = text.trim();

        if (!trimmedText || !socket || !activeUser) {
            return;
        }

        socket.emit("sendMessage", {
            to: activeUser._id,
            text: trimmedText,
        });

        setText("");
    };

    const handleSelectUser = (selectedUser) => {
        setActiveUser(selectedUser);
        navigate(`/messages/${selectedUser._id}`);
    };

    const handleBack = () => {
        navigate("/messages");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        disconnectSocket();
        navigate("/", { replace: true });
    };

    const getInitial = (username) => {
        return username?.charAt(0)?.toUpperCase() || "?";
    };

    const renderAvatar = (chatUser, size = "h-10 w-10") => {
        return (
            <div
                className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white`}
            >
                {chatUser?.image ? (
                    <img
                        src={chatUser.image}
                        alt={chatUser.username}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    getInitial(chatUser?.username)
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20">
                        <span className="text-xl font-bold text-white">
                            &lt;/&gt;
                        </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-400">
                        Loading SkillSync...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-hidden bg-[#f5f7fb] text-slate-900">
            <div className="flex min-h-screen">
                <Sidebar
                    user={user}
                    navigate={navigate}
                    handleLogout={handleLogout}
                />

                <main className="flex h-screen w-full flex-col lg:ml-[245px]">
                    <div className="flex min-h-0 flex-1">
                        <div
                            className={`h-full w-full lg:flex lg:w-auto ${
                                targetId ? "hidden lg:flex" : "flex"
                            }`}
                        >
                            <ChatSidebar
                                conversations={conversations}
                                conversationsLoading={conversationsLoading}
                                onSelectUser={handleSelectUser}
                            />
                        </div>

                        <section
                            className={`min-w-0 flex-1 flex-col ${
                                targetId ? "flex" : "hidden lg:flex"
                            }`}
                        >
                            {activeUser ? (
                                <>
                                    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={handleBack}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
                                            >
                                                <ArrowLeft size={19} />
                                            </button>

                                            <div className="relative">
                                                {renderAvatar(
                                                    activeUser,
                                                    "h-10 w-10"
                                                )}

                                                {/* <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" /> */}
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="truncate text-sm font-semibold text-slate-800">
                                                    {activeUser.username}
                                                </h2>

                                                {/* <p className="text-xs text-emerald-500">
                                                    Active now
                                                </p> */}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                        >
                                            <MoreVertical size={19} />
                                        </button>
                                    </header>

                                    <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8fafc] px-3 py-5 sm:px-6 sm:py-6">
                                        <div className="mx-auto flex max-w-4xl flex-col gap-3">
                                            {messagesLoading ? (
                                                <div className="flex items-center justify-center py-32">
                                                    <p className="text-sm text-slate-400">
                                                        Loading messages...
                                                    </p>
                                                </div>
                                            ) : messages.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-32 text-center">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                                        <span className="text-xl">
                                                            👋
                                                        </span>
                                                    </div>

                                                    <p className="mt-4 text-sm font-semibold text-slate-600">
                                                        Start the conversation
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Send your first message.
                                                    </p>
                                                </div>
                                            ) : (
                                                messages.map((message) => {
                                                    const senderId =
                                                        typeof message.sender ===
                                                        "object"
                                                            ? message.sender?._id?.toString()
                                                            : message.sender?.toString();

                                                    const isMine =
                                                        senderId ===
                                                        user?._id?.toString();

                                                    return (
                                                        <div
                                                            key={message._id}
                                                            className={`flex ${
                                                                isMine
                                                                    ? "justify-end"
                                                                    : "justify-start"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm sm:max-w-[65%] ${
                                                                    isMine
                                                                        ? "rounded-br-md bg-gradient-to-r from-blue-600 to-violet-600 text-white"
                                                                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                                                                }`}
                                                            >
                                                                <p className="break-words leading-5">
                                                                    {
                                                                        message.message
                                                                    }
                                                                </p>

                                                                <p
                                                                    className={`mt-1 text-[10px] ${
                                                                        isMine
                                                                            ? "text-blue-100"
                                                                            : "text-slate-400"
                                                                    }`}
                                                                >
                                                                    {new Date(
                                                                        message.createdAt
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        }
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 sm:px-5">
                                        <form
                                            onSubmit={handleSendMessage}
                                            className="mx-auto flex max-w-4xl items-end gap-2"
                                        >
                                            <textarea
                                                value={text}
                                                onChange={(event) =>
                                                    setText(event.target.value)
                                                }
                                                onKeyDown={(event) => {
                                                    if (
                                                        event.key === "Enter" &&
                                                        !event.shiftKey
                                                    ) {
                                                        event.preventDefault();
                                                        handleSendMessage(
                                                            event
                                                        );
                                                    }
                                                }}
                                                rows={1}
                                                placeholder="Write a message..."
                                                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                                            />

                                            <button
                                                type="submit"
                                                disabled={
                                                    !text.trim() || !socket
                                                }
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-1 items-center justify-center bg-[#f8fafc] px-6">
                                    <div className="text-center">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20">
                                            <MessageCircle
                                                size={30}
                                                className="text-white"
                                            />
                                        </div>

                                        <h2 className="mt-5 text-lg font-bold text-slate-800">
                                            Start a conversation
                                        </h2>

                                        <p className="mt-2 max-w-sm text-sm text-slate-400">
                                            Search for a developer and start
                                            chatting.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </main>

                <MobileNav navigate={navigate} />
            </div>
        </div>
    );
};

export default Chat;