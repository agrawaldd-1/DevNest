import {
    Heart,
    MessageCircle,
    Send,
    Volume2,
    VolumeX,
    Play,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import Avatar from "./Avatar.jsx";

import {
    toggleLike,
    addComment,
    getComments,
} from "../services/engagementService.js";

const ShortCard = ({ short }) => {
    const videoRef = useRef(null);
    const cardRef = useRef(null);

    const [isPlaying, setIsPlaying] =
        useState(false);

    const [isMuted, setIsMuted] =
        useState(true);

    const [liked, setLiked] = useState(
        Boolean(short?.isLiked)
    );

    const [likeCount, setLikeCount] =
        useState(
            Number(short?.likeCount) || 0
        );

    const [commentCount, setCommentCount] =
        useState(
            Number(short?.commentCount) || 0
        );

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

    useEffect(() => {
        const video = videoRef.current;
        const card = cardRef.current;

        if (!video || !card) {
            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];

                    if (entry.isIntersecting) {
                        video
                            .play()
                            .then(() => {
                                setIsPlaying(true);
                            })
                            .catch(() => {
                                setIsPlaying(false);
                            });
                    } else {
                        video.pause();
                        setIsPlaying(false);
                    }
                },
                {
                    threshold: 0.75,
                }
            );

        observer.observe(card);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleVideoClick = () => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        if (video.paused) {
            video
                .play()
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(() => {});
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const handleMute = (event) => {
        event.stopPropagation();

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
                setLiked(response.liked);

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

    return (
        <>
            <article
                ref={cardRef}
                className="
                    relative
                    flex
                    h-screen
                    w-full
                    snap-start
                    items-center
                    justify-center
                    bg-black
                "
            >
                <div
                    className="
                        relative
                        h-full
                        w-full
                        overflow-hidden
                        bg-[#111]
                        sm:h-[calc(100vh-24px)]
                        sm:max-h-[900px]
                        sm:w-auto
                        sm:aspect-[9/16]
                        sm:rounded-2xl
                    "
                >
                    <video
                        ref={videoRef}
                        src={short?.video}
                        muted={isMuted}
                        loop
                        playsInline
                        preload="metadata"
                        onClick={handleVideoClick}
                        className="
                            h-full
                            w-full
                            cursor-pointer
                            object-cover
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            bg-gradient-to-b
                            from-black/30
                            via-transparent
                            to-black/80
                        "
                    />

                    {/* Mute Button */}

                    <div
                        className="
                            absolute
                            right-3
                            top-4
                            z-30
                        "
                    >
                        <button
                            type="button"
                            onClick={handleMute}
                            className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-full
                                bg-black/55
                                text-white
                                backdrop-blur
                                transition
                                hover:bg-black/75
                            "
                        >
                            {isMuted ? (
                                <VolumeX
                                    size={20}
                                />
                            ) : (
                                <Volume2
                                    size={20}
                                />
                            )}
                        </button>
                    </div>

                    {/* Play Button */}

                    {!isPlaying && (
                        <button
                            type="button"
                            onClick={
                                handleVideoClick
                            }
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                z-20
                                flex
                                h-16
                                w-16
                                -translate-x-1/2
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                bg-black/55
                                text-white
                                backdrop-blur
                            "
                        >
                            <Play
                                size={28}
                                fill="currentColor"
                            />
                        </button>
                    )}

                    {/* User + Caption */}

                    <div
                        className="
                            absolute
                            bottom-24
                            left-4
                            right-20
                            z-20
                            text-white
                            sm:bottom-7
                            sm:left-5
                            sm:right-20
                        "
                    >
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

                            <div className="min-w-0">

                                <p className="text-sm font-semibold">
                                    {
                                        short
                                            ?.userId
                                            ?.username
                                    }
                                </p>

                                <p className="text-[11px] text-white/70">
                                    {formatTime(
                                        short?.createdAt
                                    )}
                                </p>

                            </div>

                        </div>

                        {short?.caption && (
                            <p
                                className="
                                    mt-3
                                    max-w-full
                                    text-sm
                                    leading-5
                                    text-white
                                    sm:text-[15px]
                                "
                            >
                                {short.caption}
                            </p>
                        )}
                    </div>

                    {/* Engagement Buttons */}

                    <div
                        className="
                            absolute
                            bottom-24
                            right-3
                            z-30
                            flex
                            flex-col
                            items-center
                            gap-5
                            text-white
                            sm:bottom-8
                            sm:right-3
                        "
                    >
                        {/* Like */}

                        <button
                            type="button"
                            onClick={handleLike}
                            disabled={likeLoading}
                            className="
                                flex
                                flex-col
                                items-center
                                gap-1
                            "
                        >
                            <div
                                className={`
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black/55
                                    backdrop-blur
                                    ${
                                        liked
                                            ? "text-red-500"
                                            : "text-white"
                                    }
                                `}
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

                        {/* Comments */}

                        <button
                            type="button"
                            onClick={
                                handleComments
                            }
                            className="
                                flex
                                flex-col
                                items-center
                                gap-1
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black/55
                                    backdrop-blur
                                "
                            >
                                <MessageCircle
                                    size={24}
                                />
                            </div>

                            <span className="text-[11px] font-semibold">
                                {commentCount}
                            </span>
                        </button>

                        {/* Share */}

                        <button
                            type="button"
                            onClick={
                                handleShare
                            }
                            className="
                                flex
                                flex-col
                                items-center
                                gap-1
                            "
                        >
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-black/55
                                    backdrop-blur
                                "
                            >
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
            </article>

            {/* Comments Modal */}

            {showComments && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/70
                        px-4
                    "
                >
                    <div
                        className="
                            flex
                            max-h-[80vh]
                            w-full
                            max-w-[500px]
                            flex-col
                            overflow-hidden
                            rounded-2xl
                            bg-white
                        "
                    >
                        {/* Header */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                px-5
                                py-4
                            "
                        >
                            <h2 className="font-semibold">
                                Comments
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowComments(
                                        false
                                    )
                                }
                                className="
                                    text-xl
                                    text-slate-500
                                    hover:text-black
                                "
                            >
                                ×
                            </button>
                        </div>

                        {/* Comments */}

                        <div
                            className="
                                flex-1
                                overflow-y-auto
                                px-5
                                py-4
                            "
                        >
                            {commentsLoading ? (
                                <p
                                    className="
                                        py-10
                                        text-center
                                        text-sm
                                        text-slate-400
                                    "
                                >
                                    Loading comments...
                                </p>
                            ) : comments.length ===
                              0 ? (
                                <p
                                    className="
                                        py-10
                                        text-center
                                        text-sm
                                        text-slate-400
                                    "
                                >
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
                                                    <p className="text-sm">
                                                        <span className="font-semibold">
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

                        {/* Add Comment */}

                        <form
                            onSubmit={
                                handleAddComment
                            }
                            className="
                                flex
                                gap-2
                                border-t
                                p-4
                            "
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
                                className="
                                    min-w-0
                                    flex-1
                                    rounded-xl
                                    border
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-violet-500
                                "
                            />

                            <button
                                type="submit"
                                disabled={
                                    !commentText.trim() ||
                                    commentSubmitting
                                }
                                className="
                                    rounded-xl
                                    bg-slate-900
                                    px-4
                                    text-sm
                                    font-semibold
                                    text-white
                                    disabled:opacity-50
                                "
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

export default ShortCard;