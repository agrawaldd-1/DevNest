import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Send,
    LoaderCircle,
} from "lucide-react";

import { viewPost } from "../services/postService.js";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import Avatar from "./Avatar.jsx";

const ViewPost = () => {
    const navigate = useNavigate();
    const { postId } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await viewPost(postId);

                if (response.success) {
                    setPost(response.post);
                } else {
                    setError(
                        response.message || "Failed to fetch post"
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

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString(
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

                        <Navbar navigate={navigate} />

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

                    <MobileNav navigate={navigate} />

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

                        <Navbar navigate={navigate} />

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
                                    onClick={() => navigate(-1)}
                                    className="mt-5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Go Back
                                </button>

                            </div>

                        </div>

                    </main>

                    <MobileNav navigate={navigate} />

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

                    <Navbar navigate={navigate} />

                    <div className="px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">

                        <div className="mx-auto max-w-[900px]">

                            

                            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

                                <div className="grid min-h-0 grid-cols-1 lg:h-[calc(100vh-150px)] lg:max-h-[720px] lg:grid-cols-[55%_45%]">

                                    <div className="flex h-[55vh] min-h-[400px] items-center justify-center bg-black lg:h-full">

                                        {post?.image ? (
                                            <img
                                                src={post.image}
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
                                                        post?.userId
                                                            ?.username
                                                    }
                                                    image={
                                                        post?.userId?.image
                                                    }
                                                />

                                                <div className="min-w-0">

                                                    <h3 className="truncate text-sm font-semibold text-slate-900">
                                                        {
                                                            post?.userId
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
                                                    navigate(-1)
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
                                                            post?.userId
                                                                ?.username
                                                        }
                                                        image={
                                                            post?.userId
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

                                        </div>

                                        <div className="shrink-0 border-t border-slate-100">

                                            <div className="flex items-center gap-5 px-4 py-3">

                                                <button
                                                    type="button"
                                                    className="text-slate-800 transition hover:scale-105 hover:text-red-500"
                                                >
                                                    <Heart
                                                        size={24}
                                                        strokeWidth={1.8}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="text-slate-800 transition hover:scale-105 hover:text-blue-600"
                                                >
                                                    <MessageCircle
                                                        size={24}
                                                        strokeWidth={1.8}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="text-slate-800 transition hover:scale-105 hover:text-slate-500"
                                                >
                                                    <Send
                                                        size={24}
                                                        strokeWidth={1.8}
                                                    />
                                                </button>

                                            </div>

                                            <div className="px-4 pb-2">

                                                <p className="text-sm font-semibold text-slate-900">
                                                    0 likes
                                                </p>

                                            </div>

                                            <div className="px-4 pb-4">

                                                <p className="text-[11px] text-slate-400">
                                                    {formatDate(
                                                        post?.createdAt
                                                    )}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </article>

                        </div>

                    </div>

                </main>

                <MobileNav navigate={navigate} />

            </div>

        </div>
    );
};

export default ViewPost;