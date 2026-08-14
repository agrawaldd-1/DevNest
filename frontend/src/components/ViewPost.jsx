import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Heart,
    MessageCircle,
    Send,
    LoaderCircle,
} from "lucide-react";

import { viewPost } from "../services/postService.js";
import {
    toggleLike,
    addComment,
    getComments,
} from "../services/engagementService.js";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import Avatar from "./Avatar.jsx";

const ViewPost = () => {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [post, setPost] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    const [error, setError] = useState("");

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);

    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await viewPost(postId);

                if (response.success) {
                    setPost(response.post);

                    setLiked(
                        Boolean(response.post?.isLiked)
                    );

                    setLikeCount(
                        Number(
                            response.post?.likeCount
                        ) || 0
                    );

                    setCommentCount(
                        Number(
                            response.post?.commentCount
                        ) || 0
                    );
                } else {
                    setError(
                        response.message ||
                            "Failed to fetch post"
                    );
                }
            } catch (error) {
                console.error(error);

                setError(
                    error?.response?.data?.message ||
                        "Failed to load post"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);

            const response = await getComments(
                "post",
                postId
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

    const handleLike = async () => {
        if (likeLoading) {
            return;
        }

        try {
            setLikeLoading(true);

            const response = await toggleLike(
                "post",
                postId
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

    const handleComments = async () => {
        if (showComments) {
            setShowComments(false);
            return;
        }

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
                postId,
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
                setShowComments(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleShare = async () => {
        const shareUrl =
            window.location.href;

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

    const formatTime = (date) => {
        if (!date) {
            return "";
        }

        const createdAt =
            new Date(date);

        if (
            Number.isNaN(
                createdAt.getTime()
            )
        ) {
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

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleDateString(
            undefined,
            {
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f7fb]">
                <div className="flex min-h-screen">
                    <Sidebar
                        user={null}
                        navigate={navigate}
                    />

                    <main className="w-full lg:ml-[245px]">
                        <Navbar
                            navigate={navigate}
                        />

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
                            <div className="text-center">
                                <LoaderCircle
                                    size={30}
                                    className="mx-auto animate-spin text-violet-600"
                                />

                                <p className="mt-3 text-sm text-slate-500">
                                    Loading post...
                                </p>
                            </div>
                        </div>
                    </main>

                    <MobileNav
                        navigate={navigate}
                    />
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#f5f7fb]">
                <div className="flex min-h-screen">
                    <Sidebar
                        user={null}
                        navigate={navigate}
                    />

                    <main className="w-full lg:ml-[245px]">
                        <Navbar
                            navigate={navigate}
                        />

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Post not found
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    {error ||
                                        "This post may have been deleted."}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            -1
                                        )
                                    }
                                    className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </main>

                    <MobileNav
                        navigate={navigate}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
            <div className="flex min-h-screen">
                <Sidebar
                    user={null}
                    navigate={navigate}
                />

                <main className="w-full lg:ml-[245px]">
                    <Navbar
                        navigate={navigate}
                    />

                    <div className="px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
                        <div className="mx-auto max-w-[900px]">
                            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                <div className="grid min-h-0 grid-cols-1 lg:h-[calc(100vh-150px)] lg:max-h-[720px] lg:grid-cols-[55%_45%]">
                                    <div className="flex h-[55vh] min-h-[400px] items-center justify-center bg-black lg:h-full">
                                        {post?.image ? (
                                            <img
                                                src={
                                                    post.image
                                                }
                                                alt={
                                                    post?.caption ||
                                                    "Post"
                                                }
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-slate-100 p-10">
                                                <p className="max-w-md text-center text-lg leading-8 text-slate-600">
                                                    {post?.caption ||
                                                        "No content"}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex min-h-[500px] flex-col bg-white lg:min-h-0">
                                        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Avatar
                                                    username={
                                                        post
                                                            ?.userId
                                                            ?.username
                                                    }
                                                    image={
                                                        post
                                                            ?.userId
                                                            ?.image
                                                    }
                                                />

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold text-slate-900">
                                                        {
                                                            post
                                                                ?.userId
                                                                ?.username
                                                        }
                                                    </h3>

                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        {formatTime(
                                                            post?.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(
                                                        -1
                                                    )
                                                }
                                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                            >
                                                ×
                                            </button>
                                        </div>

                                        <div className="min-h-0 flex-1 overflow-y-auto">
                                            {post?.caption && (
                                                <div className="flex gap-3 px-4 py-4">
                                                    <Avatar
                                                        username={
                                                            post
                                                                ?.userId
                                                                ?.username
                                                        }
                                                        image={
                                                            post
                                                                ?.userId
                                                                ?.image
                                                        }
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="text-sm leading-6 text-slate-700">
                                                            <span className="font-semibold text-slate-900">
                                                                {
                                                                    post
                                                                        ?.userId
                                                                        ?.username
                                                                }
                                                            </span>{" "}
                                                            {
                                                                post.caption
                                                            }
                                                        </p>

                                                        <p className="mt-2 text-xs text-slate-400">
                                                            {formatTime(
                                                                post?.createdAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {showComments && (
                                                <div className="border-t border-slate-100 px-4 py-4">
                                                    <div className="mb-4 flex items-center justify-between">
                                                        <h3 className="text-sm font-semibold text-slate-900">
                                                            Comments
                                                        </h3>

                                                        <span className="text-xs text-slate-400">
                                                            {
                                                                commentCount
                                                            }
                                                        </span>
                                                    </div>

                                                    {commentsLoading ? (
                                                        <div className="py-6 text-center">
                                                            <LoaderCircle
                                                                size={
                                                                    20
                                                                }
                                                                className="mx-auto animate-spin text-violet-600"
                                                            />

                                                            <p className="mt-2 text-xs text-slate-400">
                                                                Loading comments...
                                                            </p>
                                                        </div>
                                                    ) : comments.length ===
                                                      0 ? (
                                                        <div className="py-6 text-center">
                                                            <MessageCircle
                                                                size={
                                                                    25
                                                                }
                                                                className="mx-auto text-slate-300"
                                                            />

                                                            <p className="mt-2 text-sm text-slate-400">
                                                                No comments yet.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
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
                                            )}
                                        </div>

                                        <div className="shrink-0 border-t border-slate-100">
                                            <div className="flex items-center gap-5 px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleLike
                                                    }
                                                    disabled={
                                                        likeLoading
                                                    }
                                                    className={`transition hover:scale-105 ${
                                                        liked
                                                            ? "text-red-500"
                                                            : "text-slate-800 hover:text-red-500"
                                                    }`}
                                                >
                                                    <Heart
                                                        size={
                                                            24
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
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
                                                        size={
                                                            24
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleShare
                                                    }
                                                    className="text-slate-800 transition hover:scale-105 hover:text-slate-500"
                                                >
                                                    <Send
                                                        size={
                                                            24
                                                        }
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <div className="px-4 pb-2">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {
                                                        likeCount
                                                    }{" "}
                                                    {likeCount ===
                                                    1
                                                        ? "like"
                                                        : "likes"}
                                                </p>
                                            </div>

                                            <div className="px-4 pb-3">
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleComments
                                                    }
                                                    className="text-xs text-slate-400 transition hover:text-slate-600"
                                                >
                                                    {
                                                        commentCount
                                                    }{" "}
                                                    {commentCount ===
                                                    1
                                                        ? "comment"
                                                        : "comments"}
                                                </button>
                                            </div>

                                            <div className="px-4 pb-4">
                                                <p className="text-[11px] text-slate-400">
                                                    {formatDate(
                                                        post?.createdAt
                                                    )}
                                                </p>

                                                {showComments && (
                                                    <form
                                                        onSubmit={
                                                            handleAddComment
                                                        }
                                                        className="mt-3 flex items-center gap-2"
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
                                                                    event
                                                                        .target
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
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </main>

                <MobileNav
                    navigate={navigate}
                />
            </div>
        </div>
    );
};

export default ViewPost;