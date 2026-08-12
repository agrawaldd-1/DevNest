import {
    Heart,
    MessageCircle,
    Send,
} from "lucide-react";

import Avatar from "./Avatar.jsx";

const PostCard = ({ post }) => {
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

        const minutes = Math.floor(difference / 60);

        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours}h`;
        }

        const days = Math.floor(hours / 24);

        if (days < 7) {
            return `${days}d`;
        }

        return createdAt.toLocaleDateString();
    };

    return (
        <article className="mx-auto mb-8 w-full max-w-[520px]">

            <div className="flex items-center px-1 pb-2">

                <div className="flex items-center gap-2.5">

                    <Avatar
                        username={post?.userId?.username}
                        image={post?.userId?.image}
                    />

                    <div className="leading-tight">

                        <h3 className="text-sm font-semibold text-slate-900">
                            {post?.userId?.username}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                            {formatTime(post?.createdAt)}
                        </p>

                    </div>

                </div>

            </div>

            {post?.image && (
                <div className="overflow-hidden rounded-lg bg-slate-100">

                    <img
                        src={post.image}
                        alt={post?.caption || "Post"}
                        className="h-[380px] w-full object-cover"
                    />

                </div>
            )}

            <div className="pt-2">

                <div className="flex items-center gap-4">

                    <button
                        type="button"
                        className="text-slate-800 transition hover:text-red-500"
                    >
                        <Heart
                            size={22}
                            strokeWidth={1.8}
                        />
                    </button>

                    <button
                        type="button"
                        className="text-slate-800 transition hover:text-blue-600"
                    >
                        <MessageCircle
                            size={22}
                            strokeWidth={1.8}
                        />
                    </button>

                    <button
                        type="button"
                        className="text-slate-800 transition hover:text-slate-500"
                    >
                        <Send
                            size={22}
                            strokeWidth={1.8}
                        />
                    </button>

                </div>

                <p className="mt-1.5 text-xs font-semibold text-slate-900">
                    0 likes
                </p>

                {post?.caption && (
                    <p className="mt-1 text-xs leading-5 text-slate-700">
                        <span className="font-semibold text-slate-900">
                            {post?.userId?.username}
                        </span>{" "}
                        {post.caption}
                    </p>
                )}

            </div>

        </article>
    );
};

export default PostCard;