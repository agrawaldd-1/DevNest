import {
    Heart,
    MessageCircle,
    Send,
    Volume2,
    VolumeX,
    Play,
    Pause,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import Avatar from "./Avatar.jsx";

import {
    toggleLike,
    addComment,
    getComments,
} from "../services/engagementService.js";

import api from "../services/api.js";

const ViewShort = () => {
    const { shortId } = useParams();
    const navigate = useNavigate();

    const videoRef = useRef(null);

    const [short, setShort] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [isMuted, setIsMuted] =
        useState(true);

    const [liked, setLiked] =
        useState(false);

    const [likeCount, setLikeCount] =
        useState(0);

    const [commentCount, setCommentCount] =
        useState(0);

    const [showComments, setShowComments] =
        useState(false);

    const [comments, setComments] =
        useState([]);

    const [commentText, setCommentText] =
        useState("");

    const [commentsLoading, setCommentsLoading] =
        useState(false);

    const [commentSubmitting, setCommentSubmitting] =
        useState(false);

    const [likeLoading, setLikeLoading] =
        useState(false);

    useEffect(() => {
        const fetchShort = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/shorts/${shortId}`
                );

                const data = response.data;

                if (!data.success) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch short"
                    );
                }

                const fetchedShort =
                    data.short;

                setShort(fetchedShort);

                setLiked(
                    Boolean(
                        fetchedShort.isLiked
                    )
                );

                setLikeCount(
                    Number(
                        fetchedShort.likeCount
                    ) || 0
                );

                setCommentCount(
                    Number(
                        fetchedShort.commentCount
                    ) || 0
                );
            } catch (error) {
                console.error(error);

                setError(
                    error?.response?.data
                        ?.message ||
                        error.message ||
                        "Failed to fetch short"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchShort();
    }, [shortId]);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        const handlePlay = () => {
            setIsPlaying(true);
        };

        const handlePause = () => {
            setIsPlaying(false);
        };

        video.addEventListener(
            "play",
            handlePlay
        );

        video.addEventListener(
            "pause",
            handlePause
        );

        return () => {
            video.removeEventListener(
                "play",
                handlePlay
            );

            video.removeEventListener(
                "pause",
                handlePause
            );
        };
    }, [short]);

    const handleVideoClick = () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        if (video.paused) {
            video
                .play()
                .catch(() => {});
        } else {
            video.pause();
        }
    };

    const handleMute = () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        video.muted = !video.muted;

        setIsMuted(video.muted);
    };

    const handleLike = async () => {
        if (likeLoading) {
            return;
        }

        try {
            setLikeLoading(true);

            const response =
                await toggleLike(
                    "short",
                    short._id
                );

            if (response.success) {
                setLiked(
                    response.liked
                );

                setLikeCount(
                    Number(
                        response.likeCount
                    ) || 0
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

            const response =
                await getComments(
                    "short",
                    short._id
                );

            if (response.success) {
                setComments(
                    response.comments || []
                );

                setCommentCount(
                    Number(
                        response.count
                    ) ||
                        response.comments
                            ?.length ||
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

    const handleAddComment = async (
        event
    ) => {
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

            const response =
                await addComment(
                    "short",
                    short._id,
                    trimmedComment
                );

            if (response.success) {
                setComments(
                    (previous) => [
                        response.comment,
                        ...previous,
                    ]
                );

                setCommentCount(
                    (previous) =>
                        previous + 1
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
        const shareUrl =
            `${window.location.origin}/shorts/${short._id}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title:
                        short?.caption ||
                        "SkillSync Short",
                    text:
                        "Check this Short on SkillSync",
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

        const difference =
            Math.floor(
                (now - createdAt) /
                    1000
            );

        if (difference < 60) {
            return "Just now";
        }

        const minutes =
            Math.floor(
                difference / 60
            );

        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours =
            Math.floor(
                minutes / 60
            );

        if (hours < 24) {
            return `${hours}h`;
        }

        const days =
            Math.floor(
                hours / 24
            );

        if (days < 7) {
            return `${days}d`;
        }

        return createdAt.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white" />

                    <p className="mt-4 text-sm text-white/60">
                        Loading Short...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !short) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
                <div className="text-center">

                    <h2 className="text-lg font-semibold">
                        Unable to load Short
                    </h2>

                    <p className="mt-2 text-sm text-white/50">
                        {error ||
                            "Short not found"}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/shorts"
                            )
                        }
                        className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black"
                    >
                        Back to Shorts
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">

            <div className="flex min-h-screen items-center justify-center">

                <div className="relative h-screen w-full max-w-[500px] overflow-hidden bg-[#111] sm:h-[95vh] sm:rounded-2xl">

                    <video
                        ref={videoRef}
                        src={short.video}
                        muted={isMuted}
                        loop
                        playsInline
                        autoPlay
                        onClick={
                            handleVideoClick
                        }
                        className="h-full w-full cursor-pointer object-cover"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/shorts"
                            )
                        }
                        className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
                    >
                        ×
                    </button>

                    <button
                        type="button"
                        onClick={
                            handleMute
                        }
                        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
                    >
                        {isMuted ? (
                            <VolumeX
                                size={19}
                            />
                        ) : (
                            <Volume2
                                size={19}
                            />
                        )}
                    </button>

                    {!isPlaying && (
                        <button
                            type="button"
                            onClick={
                                handleVideoClick
                            }
                            className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"
                        >
                            <Play
                                size={28}
                                fill="currentColor"
                            />
                        </button>
                    )}

                    <div className="absolute bottom-6 left-4 right-20 text-white">

                        <div className="flex items-center gap-3">

                            <Avatar
                                username={
                                    short
                                        ?.userId
                                        ?.username
                                }
                                image={
                                    short
                                        ?.userId
                                        ?.image
                                }
                            />

                            <div>

                                <p className="text-sm font-semibold">
                                    {
                                        short
                                            ?.userId
                                            ?.username
                                    }
                                </p>

                                <p className="mt-0.5 text-[11px] text-white/60">
                                    {formatTime(
                                        short.createdAt
                                    )}
                                </p>

                            </div>

                        </div>

                        {short.caption && (
                            <p className="mt-3 text-sm leading-5 text-white">
                                {
                                    short.caption
                                }
                            </p>
                        )}

                    </div>

                    <div className="absolute bottom-20 right-3 flex flex-col items-center gap-5 text-white">

                        <button
                            type="button"
                            onClick={
                                handleLike
                            }
                            disabled={
                                likeLoading
                            }
                            className="flex flex-col items-center gap-1"
                        >
                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur ${
                                    liked
                                        ? "text-red-500"
                                        : "text-white"
                                }`}
                            >
                                <Heart
                                    size={24}
                                    fill={
                                        liked
                                            ? "currentColor"
                                            : "none"
                                    }
                                />
                            </div>

                            <span className="text-[11px] font-semibold">
                                {likeCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleComments
                            }
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                                <MessageCircle
                                    size={24}
                                />
                            </div>

                            <span className="text-[11px] font-semibold">
                                {commentCount}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleShare
                            }
                            className="flex flex-col items-center gap-1"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                                <Send
                                    size={23}
                                />
                            </div>

                            <span className="text-[11px] font-semibold">
                                Share
                            </span>
                        </button>

                    </div>

                </div>

            </div>

            {showComments && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

                    <div className="flex max-h-[80vh] w-full max-w-[500px] flex-col overflow-hidden rounded-2xl bg-white">

                        <div className="flex items-center justify-between border-b px-5 py-4">

                            <h2 className="font-semibold text-slate-900">
                                Comments
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowComments(
                                        false
                                    )
                                }
                                className="text-xl text-slate-500 hover:text-black"
                            >
                                ×
                            </button>

                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4">

                            {commentsLoading ? (
                                <p className="py-10 text-center text-sm text-slate-400">
                                    Loading comments...
                                </p>
                            ) : comments.length ===
                              0 ? (
                                <p className="py-10 text-center text-sm text-slate-400">
                                    No comments yet.
                                </p>
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

                                                <div>

                                                    <p className="text-sm text-slate-700">

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
                            className="flex gap-2 border-t p-4"
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
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500"
                            />

                            <button
                                type="submit"
                                disabled={
                                    !commentText.trim() ||
                                    commentSubmitting
                                }
                                className="rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {commentSubmitting
                                    ? "..."
                                    : "Post"}
                            </button>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ViewShort;