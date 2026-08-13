import {
    Heart,
    Send,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

import { useState } from "react";
import Avatar from "./Avatar.jsx";

const ProjectCard = ({ project }) => {
    const [currentImage, setCurrentImage] = useState(0);

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

    const renderDescription = (description) => {
        if (!description) return null;

        const parts = description.split(
            /(https?:\/\/[^\s]+|#[a-zA-Z0-9_]+)/g
        );

        return parts.map((part, index) => {
            if (part.startsWith("#")) {
                return (
                    <span
                        key={index}
                        className="font-semibold text-blue-600"
                    >
                        {part}
                    </span>
                );
            }

            if (
                part.startsWith("http://") ||
                part.startsWith("https://")
            ) {
                const cleanUrl = part.replace(
                    /[.,!?;:]+$/,
                    ""
                );

                return (
                    <a
                        key={index}
                        href={cleanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-medium text-blue-600 hover:underline"
                    >
                        {cleanUrl}
                    </a>
                );
            }

            return part;
        });
    };

    const images = project?.images || [];

    const nextImage = () => {
        if (images.length <= 1) return;

        setCurrentImage((prev) =>
            prev === images.length - 1
                ? 0
                : prev + 1
        );
    };

    const previousImage = () => {
        if (images.length <= 1) return;

        setCurrentImage((prev) =>
            prev === 0
                ? images.length - 1
                : prev - 1
        );
    };

    return (
        <article className="mx-auto mb-8 w-full max-w-[520px]">

            <div className="flex items-center px-1 pb-2">

                <div className="flex items-center gap-2.5">

                    <Avatar
                        username={project?.userId?.username}
                        image={project?.userId?.image}
                    />

                    <div className="leading-tight">

                        <h3 className="text-sm font-semibold text-slate-900">
                            {project?.userId?.username}
                        </h3>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                            {formatTime(project?.createdAt)}
                        </p>

                    </div>

                </div>

            </div>

            <div className="mb-2 px-1">

                <h2 className="text-base font-bold text-slate-900">
                    {project?.title}
                </h2>

            </div>

            {project?.description && (
                <div className="px-1">

                    <p className="whitespace-pre-line text-xs leading-5 text-slate-700">
                        <span className="font-semibold text-slate-900">
                            {project?.userId?.username}
                        </span>{" "}
                        {renderDescription(
                            project.description
                        )}
                    </p>

                </div>
            )}

            {project?.links?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 px-1">

                    {project.links.map(
                        (link, index) => {
                            if (
                                !link?.url?.trim()
                            ) {
                                return null;
                            }

                            return (
                                <a
                                    key={`${link.title}-${index}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600 transition hover:border-blue-200 hover:bg-blue-100"
                                >
                                    <ExternalLink
                                        size={12}
                                    />

                                    {link.title ||
                                        "View Link"}
                                </a>
                            );
                        }
                    )}

                </div>
            )}

            {project?.mediaType === "images" &&
                images.length > 0 && (
                    <div className="relative mt-4 overflow-hidden rounded-lg bg-slate-100">

                        <img
                            src={images[currentImage]}
                            alt={
                                project?.title ||
                                "Project"
                            }
                            className="h-[380px] w-full object-cover"
                        />

                        {images.length > 1 && (
                            <button
                                type="button"
                                onClick={previousImage}
                                className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                            >
                                <ChevronLeft size={18} />
                            </button>
                        )}

                        {images.length > 1 && (
                            <button
                                type="button"
                                onClick={nextImage}
                                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
                            >
                                <ChevronRight size={18} />
                            </button>
                        )}

                        {images.length > 1 && (
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">

                                {images.map(
                                    (_, index) => (
                                        <button
                                            key={index}
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
                                                    : "bg-white/50"
                                            }`}
                                        />
                                    )
                                )}

                            </div>
                        )}

                        {images.length > 1 && (
                            <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white">
                                {currentImage + 1}/
                                {images.length}
                            </div>
                        )}

                    </div>
                )}

            {project?.mediaType === "video" &&
                project?.video && (
                    <div className="mt-4 overflow-hidden rounded-lg bg-black">

                        <video
                            src={project.video}
                            controls
                            className="h-[380px] w-full object-contain"
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

                {project?.techStack?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">

                        {project.techStack.map(
                            (tech, index) => (
                                <span
                                    key={`${tech}-${index}`}
                                    className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                                >
                                    {tech}
                                </span>
                            )
                        )}

                    </div>
                )}

            </div>

        </article>
    );
};

export default ProjectCard;