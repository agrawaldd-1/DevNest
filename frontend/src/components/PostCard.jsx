import { useEffect, useState } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar.jsx";
import { toggleLike, addComment, getComments } from "../services/engagementService.js";
import { sendConnectionRequest, getConnectionStatus } from "../services/connectionService.js";

const PostCard = ({ post, currentUserId }) => {
    const [liked, setLiked] = useState(Boolean(post?.isLiked));
    const [likeCount, setLikeCount] = useState(Number(post?.likeCount) || 0);
    const [commentCount, setCommentCount] = useState(Number(post?.commentCount) || 0);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState("connect");
    const [connectionLoading, setConnectionLoading] = useState(false);

    const getId = (value) => {
        if (!value) return null;
        if (typeof value === "object") return value?._id?.toString() || value?.id?.toString() || null;
        return value.toString();
    };

    const getLoggedInUserId = () => {
        const token = localStorage.getItem("token");

        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload?.id?.toString() || payload?._id?.toString() || null;
        } catch (error) {
            console.error("JWT decode error:", error);
            return null;
        }
    };

    const postOwnerId = getId(post?.userId);
    const loggedInUserId = getLoggedInUserId();
    const isOwnPost = Boolean(loggedInUserId && postOwnerId && loggedInUserId === postOwnerId);

    console.log("POST OWNER:", postOwnerId);
    console.log("LOGGED USER:", loggedInUserId);
    console.log("OWN POST:", isOwnPost);

    useEffect(() => {
        if (!loggedInUserId || !postOwnerId || isOwnPost) return;

        const checkConnection = async () => {
            try {
                const response = await getConnectionStatus(postOwnerId);

                if (response?.success) {
                    setConnectionStatus(response.status);
                }
            } catch (error) {
                console.error("Connection status error:", error);
            }
        };

        checkConnection();
    }, [loggedInUserId, postOwnerId, isOwnPost]);

    const handleConnect = async () => {
        if (connectionLoading || connectionStatus !== "connect" || !postOwnerId) return;

        try {
            setConnectionLoading(true);

            const response = await sendConnectionRequest(postOwnerId);

            if (response?.success) {
                setConnectionStatus("pending");
            }
        } catch (error) {
            console.error("Connection request error:", error);

            const message = error?.response?.data?.message;

            if (message === "You are already connected with this user") {
                setConnectionStatus("connected");
            }

            if (message === "Connection request already sent") {
                setConnectionStatus("pending");
            }
        } finally {
            setConnectionLoading(false);
        }
    };

    const handleLike = async () => {
        try {
            const response = await toggleLike("post", post._id);

            if (response?.success) {
                setLiked(response.liked);
                setLikeCount(response.likeCount);
            }
        } catch (error) {
            console.error("Like error:", error);
        }
    };

    const handleComments = async () => {
        setShowComments(true);

        try {
            setCommentsLoading(true);

            const response = await getComments("post", post._id);

            if (response?.success) {
                setComments(response.comments || []);
                setCommentCount(Number(response.count) || response.comments?.length || 0);
            }
        } catch (error) {
            console.error("Get comments error:", error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleAddComment = async (event) => {
        event.preventDefault();

        const text = commentText.trim();

        if (!text || commentSubmitting) return;

        try {
            setCommentSubmitting(true);

            const response = await addComment("post", post._id, text);

            if (response?.success) {
                setComments((previous) => [response.comment, ...previous]);
                setCommentCount((previous) => previous + 1);
                setCommentText("");
            }
        } catch (error) {
            console.error("Add comment error:", error);
        } finally {
            setCommentSubmitting(false);
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

    return (
        <>
            <article className="mx-auto mb-8 w-full max-w-[520px]">
                <div className="flex items-center justify-between px-1 pb-3">
                    <div className="flex items-center gap-3">
                        <Link to={`/profile/${postOwnerId}`}>
                            <Avatar username={post?.userId?.username} image={post?.userId?.image} />
                        </Link>

                        <div>
                            <Link to={`/profile/${postOwnerId}`} className="text-sm font-semibold text-slate-900 transition hover:text-blue-600">
                                {post?.userId?.username}
                            </Link>

                            <p className="text-[11px] text-slate-400">
                                {formatTime(post?.createdAt)}
                            </p>
                        </div>
                    </div>

                    {!isOwnPost && connectionStatus === "connect" && (
                        <button type="button" onClick={handleConnect} disabled={connectionLoading} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                            {connectionLoading ? "Sending..." : "Connect"}
                        </button>
                    )}

                    {!isOwnPost && connectionStatus === "pending" && (
                        <button type="button" disabled className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">
                            Request Sent
                        </button>
                    )}

                    {!isOwnPost && connectionStatus === "connected" && (
                        <button type="button" disabled className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                            Connected
                        </button>
                    )}
                </div>

                {post?.image && (
                    <div className="overflow-hidden rounded-xl bg-slate-100">
                        <img src={post.image} alt={post?.caption || "Post"} className="h-[380px] w-full object-cover" />
                    </div>
                )}

                <div className="pt-3">
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={handleLike} className={`transition hover:scale-105 ${liked ? "text-red-500" : "text-slate-800 hover:text-red-500"}`}>
                            <Heart size={22} strokeWidth={1.8} fill={liked ? "currentColor" : "none"} />
                        </button>

                        <button type="button" onClick={handleComments} className="text-slate-800 transition hover:scale-105 hover:text-blue-600">
                            <MessageCircle size={22} strokeWidth={1.8} />
                        </button>

                        <button type="button" onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/posts/${post._id}`)} className="text-slate-800 transition hover:scale-105 hover:text-slate-500">
                            <Send size={22} strokeWidth={1.8} />
                        </button>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-slate-900">
                        {likeCount} {likeCount === 1 ? "like" : "likes"}
                    </p>

                    <button type="button" onClick={handleComments} className="mt-1 text-xs text-slate-400 hover:text-slate-600">
                        {commentCount} {commentCount === 1 ? "comment" : "comments"}
                    </button>

                    {post?.caption && (
                        <p className="mt-1 text-xs leading-5 text-slate-700">
                            <span className="font-semibold text-slate-900">{post?.userId?.username}</span>{" "}
                            {post.caption}
                        </p>
                    )}
                </div>
            </article>

            {showComments && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="flex max-h-[80vh] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <h2 className="text-base font-semibold text-slate-900">Comments</h2>

                            <button type="button" onClick={() => setShowComments(false)} className="text-xl text-slate-400 hover:text-slate-700">
                                ×
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            {commentsLoading ? (
                                <p className="py-10 text-center text-sm text-slate-400">
                                    Loading comments...
                                </p>
                            ) : comments.length === 0 ? (
                                <p className="py-10 text-center text-sm text-slate-400">
                                    No comments yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {comments.map((comment) => (
                                        <div key={comment._id} className="flex gap-3">
                                            <Avatar username={comment?.user?.username} image={comment?.user?.image} />

                                            <div>
                                                <p className="text-sm text-slate-700">
                                                    <span className="font-semibold text-slate-900">
                                                        {comment?.user?.username}
                                                    </span>{" "}
                                                    {comment.content}
                                                </p>

                                                <p className="mt-1 text-[11px] text-slate-400">
                                                    {formatTime(comment.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAddComment} className="flex gap-2 border-t border-slate-200 p-4">
                            <input type="text" value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a comment..." className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400" />

                            <button type="submit" disabled={!commentText.trim() || commentSubmitting} className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50">
                                {commentSubmitting ? "..." : "Post"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostCard;