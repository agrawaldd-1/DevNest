import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Heart,
    MessageCircle,
    Send,
    LoaderCircle,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    MoreVertical,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    viewProject,
    deleteProject,
} from "../services/projectService.js";

import {
    toggleLike,
    addComment,
    getComments,
} from "../services/engagementService.js";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import Avatar from "./Avatar.jsx";

const ViewProject = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const menuRef = useRef(null);

    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");

    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [currentImage, setCurrentImage] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const currentUserId = (() => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            return user?._id || user?.id || "";
        } catch {
            return "";
        }
    })();

    const isOwner =
        currentUserId &&
        project?.userId?._id &&
        currentUserId.toString() ===
            project.userId._id.toString();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await viewProject(projectId);

                if (response.success) {
                    setProject(response.project);
                    setCurrentImage(0);

                    setLiked(
                        Boolean(
                            response.project?.isLiked
                        )
                    );

                    setLikeCount(
                        Number(
                            response.project?.likeCount
                        ) || 0
                    );
                } else {
                    setError(
                        response.message ||
                            "Failed to fetch project"
                    );
                }
            } catch (error) {
                console.error(error);

                setError(
                    error?.response?.data?.message ||
                        "Failed to load project"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);

            const response = await getComments(
                "project",
                projectId
            );

            if (response.success) {
                setComments(response.comments || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleLike = async () => {
        if (likeLoading) return;

        try {
            setLikeLoading(true);

            const response = await toggleLike(
                "project",
                projectId
            );

            if (response.success) {
                setLiked(response.liked);
                setLikeCount(response.likeCount);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleComments = async () => {
        const nextState = !showComments;

        setShowComments(nextState);

        if (
            nextState &&
            comments.length === 0
        ) {
            await fetchComments();
        }
    };

    const handleAddComment = async (event) => {
        event.preventDefault();

        if (
            !commentText.trim() ||
            commentSubmitting
        ) {
            return;
        }

        try {
            setCommentSubmitting(true);

            const response = await addComment(
                "project",
                projectId,
                commentText.trim()
            );

            if (response.success) {
                setComments((previousComments) => [
                    response.comment,
                    ...previousComments,
                ]);

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
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title:
                        project?.title ||
                        "DevNest Project",
                    text:
                        "Check this project on DevNest",
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
            if (error?.name !== "AbortError") {
                console.error(error);
            }
        }
    };

    const handleEdit = () => {
        setShowMenu(false);

        navigate(
            `/projects/edit/${projectId}`
        );
    };

    const handleDelete = async () => {
        setShowMenu(false);

        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);

            const response =
                await deleteProject(projectId);

            if (!response.success) {
                throw new Error(
                    response.message ||
                        "Failed to delete project"
                );
            }

            navigate("/projects", {
                replace: true,
            });
        } catch (error) {
            console.error(error);

            window.alert(
                error?.response?.data?.message ||
                    error.message ||
                    "Failed to delete project"
            );
        } finally {
            setDeleting(false);
        }
    };

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

    const nextImage = () => {
        if (!project?.images?.length) return;

        setCurrentImage((previous) =>
            previous ===
            project.images.length - 1
                ? 0
                : previous + 1
        );
    };

    const previousImage = () => {
        if (!project?.images?.length) return;

        setCurrentImage((previous) =>
            previous === 0
                ? project.images.length - 1
                : previous - 1
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
                                    Loading project...
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

    if (error || !project) {
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
                                    Project not found
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    {error ||
                                        "This project may have been deleted."}
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(-1)
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
                                    <div className="relative flex h-[55vh] min-h-[400px] items-center justify-center bg-black lg:h-full">
                                        {project.mediaType ===
                                            "images" &&
                                            project.images
                                                ?.length >
                                                0 && (
                                                <>
                                                    <img
                                                        src={
                                                            project
                                                                .images[
                                                                currentImage
                                                            ]
                                                        }
                                                        alt={
                                                            project.title
                                                        }
                                                        className="h-full w-full object-contain"
                                                    />

                                                    {project
                                                        .images
                                                        .length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                previousImage
                                                            }
                                                            className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                                                        >
                                                            <ChevronLeft
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        </button>
                                                    )}

                                                    {project
                                                        .images
                                                        .length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={
                                                                nextImage
                                                            }
                                                            className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                                                        >
                                                            <ChevronRight
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        </button>
                                                    )}

                                                    {project
                                                        .images
                                                        .length >
                                                        1 && (
                                                        <div className="absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-medium text-white">
                                                            {currentImage +
                                                                1}
                                                            /
                                                            {
                                                                project
                                                                    .images
                                                                    .length
                                                            }
                                                        </div>
                                                    )}

                                                    {project
                                                        .images
                                                        .length >
                                                        1 && (
                                                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                                                            {project.images.map(
                                                                (
                                                                    _,
                                                                    index
                                                                ) => (
                                                                    <button
                                                                        key={
                                                                            index
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setCurrentImage(
                                                                                index
                                                                            )
                                                                        }
                                                                        className={`h-1.5 w-1.5 rounded-full transition ${
                                                                            index ===
                                                                            currentImage
                                                                                ? "bg-white"
                                                                                : "bg-white/40"
                                                                        }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                        {project.mediaType ===
                                            "video" &&
                                            project.video && (
                                                <video
                                                    src={
                                                        project.video
                                                    }
                                                    controls
                                                    className="h-full w-full object-contain"
                                                />
                                            )}
                                    </div>

                                    <div className="flex min-h-[500px] flex-col bg-white lg:min-h-0">
                                        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Avatar
                                                    username={
                                                        project
                                                            .userId
                                                            ?.username
                                                    }
                                                    image={
                                                        project
                                                            .userId
                                                            ?.image
                                                    }
                                                />

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold text-slate-900">
                                                        {
                                                            project
                                                                .userId
                                                                ?.username
                                                        }
                                                    </h3>

                                                    <p className="mt-0.5 text-xs text-slate-400">
                                                        {formatTime(
                                                            project.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                ref={
                                                    menuRef
                                                }
                                                className="relative flex items-center gap-1"
                                            >
                                                {isOwner && (
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowMenu(
                                                                    (
                                                                        previous
                                                                    ) =>
                                                                        !previous
                                                                )
                                                            }
                                                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                                        >
                                                            <MoreVertical
                                                                size={
                                                                    19
                                                                }
                                                            />
                                                        </button>

                                                        {showMenu && (
                                                            <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleEdit
                                                                    }
                                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                                                >
                                                                    <Pencil
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    Edit Project
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleDelete
                                                                    }
                                                                    disabled={
                                                                        deleting
                                                                    }
                                                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {deleting ? (
                                                                        <LoaderCircle
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="animate-spin"
                                                                        />
                                                                    ) : (
                                                                        <Trash2
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    )}

                                                                    {deleting
                                                                        ? "Deleting..."
                                                                        : "Delete Project"}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            -1
                                                        )
                                                    }
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>

                                        <div className="min-h-0 flex-1 overflow-y-auto">
                                            <div className="px-4 pt-5">
                                                <h1 className="text-xl font-bold text-slate-900">
                                                    {
                                                        project.title
                                                    }
                                                </h1>
                                            </div>

                                            {project.description && (
                                                <div className="flex gap-3 px-4 py-4">
                                                    <Avatar
                                                        username={
                                                            project
                                                                .userId
                                                                ?.username
                                                        }
                                                        image={
                                                            project
                                                                .userId
                                                                ?.image
                                                        }
                                                    />

                                                    <div className="min-w-0">
                                                        <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
                                                            <span className="font-semibold text-slate-900">
                                                                {
                                                                    project
                                                                        .userId
                                                                        ?.username
                                                                }
                                                            </span>{" "}
                                                            {
                                                                project.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {project.links
                                                ?.length >
                                                0 && (
                                                <div className="px-4 pb-5">
                                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Project Links
                                                    </h3>

                                                    <div className="space-y-2">
                                                        {project.links.map(
                                                            (
                                                                link,
                                                                index
                                                            ) => (
                                                                <a
                                                                    key={`${link.title}-${index}`}
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 transition hover:border-violet-200 hover:bg-violet-50"
                                                                >
                                                                    <div className="flex min-w-0 items-center gap-3">
                                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm transition group-hover:text-violet-600">
                                                                            <ExternalLink
                                                                                size={
                                                                                    17
                                                                                }
                                                                            />
                                                                        </div>

                                                                        <div className="min-w-0">
                                                                            <p className="text-sm font-semibold text-slate-800 group-hover:text-violet-700">
                                                                                {
                                                                                    link.title
                                                                                }
                                                                            </p>

                                                                            <p className="truncate text-xs text-slate-400">
                                                                                {
                                                                                    link.url
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <ExternalLink
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="ml-3 shrink-0 text-slate-400 transition group-hover:text-violet-600"
                                                                    />
                                                                </a>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {project.techStack
                                                ?.length >
                                                0 && (
                                                <div className="px-4 pb-5">
                                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                        Tech Stack
                                                    </h3>

                                                    <div className="flex flex-wrap gap-2">
                                                        {project.techStack.map(
                                                            (
                                                                tech,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={`${tech}-${index}`}
                                                                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                                                                >
                                                                    {
                                                                        tech
                                                                    }
                                                                </span>
                                                            )
                                                        )}
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
                                                                comments.length
                                                            }
                                                        </span>
                                                    </div>

                                                    {commentsLoading ? (
                                                        <div className="py-5 text-center">
                                                            <LoaderCircle
                                                                size={20}
                                                                className="mx-auto animate-spin text-violet-600"
                                                            />
                                                        </div>
                                                    ) : comments.length ===
                                                      0 ? (
                                                        <p className="py-5 text-center text-sm text-slate-400">
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

                                                                        <div className="min-w-0">
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
                                                        size={24}
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
                                                        size={24}
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
                                                        size={24}
                                                        strokeWidth={
                                                            1.8
                                                        }
                                                    />
                                                </button>
                                            </div>

                                            <div className="px-4 pb-2">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {likeCount}{" "}
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
                                                    className="text-xs text-slate-400 hover:text-slate-600"
                                                >
                                                    {comments.length}{" "}
                                                    {comments.length ===
                                                    1
                                                        ? "comment"
                                                        : "comments"}
                                                </button>
                                            </div>

                                            <div className="px-4 pb-4">
                                                <p className="text-[11px] text-slate-400">
                                                    {formatDate(
                                                        project.createdAt
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

export default ViewProject;