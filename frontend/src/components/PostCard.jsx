import { useState } from "react";
import {
    Heart,
    MessageCircle,
    Send,
    X,
    LoaderCircle,
} from "lucide-react";

import {
    toggleLike,
    addComment,
    getComments,
} from "../services/engagementService.js";

import Avatar from "./Avatar.jsx";

const PostCard = ({ post }) => {
    const [liked, setLiked] = useState(
        Boolean(post?.isLiked)
    );

    const [likeCount, setLikeCount] = useState(
        Number(post?.likeCount) || 0
    );

    const [commentCount, setCommentCount] = useState(
        Number(post?.commentCount) || 0
    );

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const [showComments, setShowComments] =
        useState(false);

    const [commentsLoading, setCommentsLoading] =
        useState(false);

    const [commentSubmitting, setCommentSubmitting] =
        useState(false);

    const [likeLoading, setLikeLoading] =
        useState(false);

    const formatTime = (date) => {
        if (!date) return "";

        const createdAt = new Date(date);

        if (Number.isNaN(createdAt.getTime())) {
            return "";
        }

        const now = new Date();

        const difference = Math.floor(
            (now - createdAt) / 1000
        );

        if (difference < 60) {
            return "Just now";
        }

        const minutes = Math.floor(
            difference / 60
        );

        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours = Math.floor(
            minutes / 60
        );

        if (hours < 24) {
            return `${hours}h`;
        }

        const days = Math.floor(
            hours / 24
        );

        if (days < 7) {
            return `${days}d`;
        }

        return createdAt.toLocaleDateString();
    };

    const handleLike = async () => {
        if (likeLoading) return;

        try {
            setLikeLoading(true);

            const response = await toggleLike(
                "post",
                post._id
            );

            if (response.success) {
                setLiked(response.liked);
                setLikeCount(
                    Number(response.likeCount) || 0
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLikeLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);

            const response = await getComments(
                "post",
                post._id
            );

            if (response.success) {
                setComments(
                    response.comments || []
                );

                setCommentCount(
                    Number(response.count) ||
                        response.comments?.length ||
                        0
                );
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleComments = async () => {
        setShowComments(true);

        await fetchComments();
    };

    const handleAddComment = async (event) => {
        event.preventDefault();

        const trimmedComment =
            commentText.trim();

        if (
            !trimmedComment ||
            commentSubmitting
        ) {
            return;
        }

        try {
            setCommentSubmitting(true);

            const response = await addComment(
                "post",
                post._id,
                trimmedComment
            );

            if (response.success) {
                setComments((previousComments) => [
                    response.comment,
                    ...previousComments,
                ]);

                setCommentCount(
                    (previousCount) =>
                        previousCount + 1
                );

                setCommentText("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/posts/${post._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title:
                        post?.caption ||
                        "SkillSync Post",
                    text:
                        "Check this post on SkillSync",
                    url: shareUrl,
                });
            } else {
                await navigator.clipboard.writeText(
                    shareUrl
                );

                window.alert(
                    "Link copied successfully!"
                );
            }
        } catch (error) {
            if (
                error?.name !==
                "AbortError"
            ) {
                console.error(error);
            }
        }
    };

    return (
        <>
            <article className="mx-auto mb-8 w-full max-w-[520px]">
                <div className="flex items-center px-1 pb-2">
                    <div className="flex items-center gap-2.5">
                        <Avatar
                            username={
                                post?.userId?.username
                            }
                            image={
                                post?.userId?.image
                            }
                        />

                        <div className="leading-tight">
                            <h3 className="text-sm font-semibold text-slate-900">
                                {
                                    post?.userId
                                        ?.username
                                }
                            </h3>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                                {formatTime(
                                    post?.createdAt
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {post?.image && (
                    <div className="overflow-hidden rounded-lg bg-slate-100">
                        <img
                            src={post.image}
                            alt={
                                post?.caption ||
                                "Post"
                            }
                            className="h-[380px] w-full object-cover"
                        />
                    </div>
                )}

                <div className="pt-2">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={handleLike}
                            disabled={likeLoading}
                            className={`transition hover:scale-105 ${
                                liked
                                    ? "text-red-500"
                                    : "text-slate-800 hover:text-red-500"
                            }`}
                        >
                            <Heart
                                size={22}
                                strokeWidth={1.8}
                                fill={
                                    liked
                                        ? "currentColor"
                                        : "none"
                                }
                            />
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleComments
                            }
                            className="text-slate-800 transition hover:scale-105 hover:text-blue-600"
                        >
                            <MessageCircle
                                size={22}
                                strokeWidth={1.8}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={handleShare}
                            className="text-slate-800 transition hover:scale-105 hover:text-slate-500"
                        >
                            <Send
                                size={22}
                                strokeWidth={1.8}
                            />
                        </button>
                    </div>

                    <p className="mt-1.5 text-xs font-semibold text-slate-900">
                        {likeCount}{" "}
                        {likeCount === 1
                            ? "like"
                            : "likes"}
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleComments
                        }
                        className="mt-1 text-xs text-slate-400 transition hover:text-slate-600"
                    >
                        {commentCount}{" "}
                        {commentCount === 1
                            ? "comment"
                            : "comments"}
                    </button>

                    {post?.caption && (
                        <p className="mt-1 text-xs leading-5 text-slate-700">
                            <span className="font-semibold text-slate-900">
                                {
                                    post
                                        ?.userId
                                        ?.username
                                }
                            </span>{" "}
                            {post.caption}
                        </p>
                    )}
                </div>
            </article>

            {showComments && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="flex max-h-[80vh] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <h2 className="text-base font-semibold text-slate-900">
                                Comments
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowComments(
                                        false
                                    )
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                            {commentsLoading ? (
                                <div className="py-10 text-center">
                                    <LoaderCircle
                                        size={24}
                                        className="mx-auto animate-spin text-violet-600"
                                    />

                                    <p className="mt-2 text-xs text-slate-400">
                                        Loading comments...
                                    </p>
                                </div>
                            ) : comments.length ===
                              0 ? (
                                <div className="py-10 text-center">
                                    <MessageCircle
                                        size={28}
                                        className="mx-auto text-slate-300"
                                    />

                                    <p className="mt-2 text-sm text-slate-400">
                                        No comments yet.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Be the first to comment.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {comments.map(
                                        (
                                            comment
                                        ) => (
                                            <div
                                                key={
                                                    comment._id
                                                }
                                                className="flex gap-3"
                                            >
                                                <Avatar
                                                    username={
                                                        comment
                                                            ?.user
                                                            ?.username
                                                    }
                                                    image={
                                                        comment
                                                            ?.user
                                                            ?.image
                                                    }
                                                />

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm leading-5 text-slate-700">
                                                        <span className="font-semibold text-slate-900">
                                                            {
                                                                comment
                                                                    ?.user
                                                                    ?.username
                                                            }
                                                        </span>{" "}
                                                        {
                                                            comment.content
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        {formatTime(
                                                            comment.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        <form
                            onSubmit={
                                handleAddComment
                            }
                            className="flex gap-2 border-t border-slate-200 p-4"
                        >
                            <input
                                type="text"
                                value={
                                    commentText
                                }
                                onChange={(
                                    event
                                ) =>
                                    setCommentText(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Add a comment..."
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                            />

                            <button
                                type="submit"
                                disabled={
                                    !commentText.trim() ||
                                    commentSubmitting
                                }
                                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {commentSubmitting
                                    ? "..."
                                    : "Post"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostCard;