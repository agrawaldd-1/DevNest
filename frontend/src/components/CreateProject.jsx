import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Upload,
    X,
} from "lucide-react";

const CreateProject = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [techStackInput, setTechStackInput] = useState("");
    const [techStack, setTechStack] = useState([]);

    const [links, setLinks] = useState([
        {
            title: "",
            url: "",
        },
    ]);

    const [mediaType, setMediaType] = useState("images");

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const addTechStack = () => {
        const tech = techStackInput.trim();

        if (!tech) return;

        if (techStack.includes(tech)) {
            setTechStackInput("");
            return;
        }

        setTechStack((prev) => [
            ...prev,
            tech,
        ]);

        setTechStackInput("");
    };

    const removeTechStack = (techToRemove) => {
        setTechStack((prev) =>
            prev.filter(
                (tech) => tech !== techToRemove
            )
        );
    };

    const handleTechStackKeyDown = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            addTechStack();
        }
    };

    const addLink = () => {
        setLinks((prev) => [
            ...prev,
            {
                title: "",
                url: "",
            },
        ]);
    };

    const removeLink = (index) => {
        setLinks((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const updateLink = (index, field, value) => {
        setLinks((prev) =>
            prev.map((link, i) =>
                i === index
                    ? {
                          ...link,
                          [field]: value,
                      }
                    : link
            )
        );
    };

    const handleImages = (event) => {
        const selectedFiles = Array.from(
            event.target.files || []
        );

        setImages(selectedFiles);
    };

    const removeImage = (index) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleVideo = (event) => {
        const selectedVideo =
            event.target.files?.[0];

        setVideo(selectedVideo || null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!title.trim()) {
            setError("Project title is required");
            return;
        }

        if (!description.trim()) {
            setError("Project description is required");
            return;
        }

        if (techStack.length === 0) {
            setError("Add at least one technology");
            return;
        }

        if (
            mediaType === "images" &&
            images.length === 0
        ) {
            setError("Please upload at least one image");
            return;
        }

        if (
            mediaType === "video" &&
            !video
        ) {
            setError("Please upload a video");
            return;
        }

        const validLinks = links.filter(
            (link) =>
                link.title.trim() &&
                link.url.trim()
        );

        const formData = new FormData();

        formData.append(
            "title",
            title.trim()
        );

        formData.append(
            "description",
            description.trim()
        );

        formData.append(
            "techStack",
            JSON.stringify(techStack)
        );

        formData.append(
            "links",
            JSON.stringify(validLinks)
        );

        formData.append(
            "mediaType",
            mediaType
        );

        if (mediaType === "images") {
            images.forEach((image) => {
                formData.append(
                    "images",
                    image
                );
            });
        }

        if (mediaType === "video" && video) {
            formData.append(
                "video",
                video
            );
        }

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/projects",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create project"
                );
            }

            setSuccess(
                "Project created successfully"
            );

            setTimeout(() => {
                navigate("/projects");
            }, 800);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7fb] px-4 py-6 sm:px-6">

            <div className="mx-auto max-w-3xl">

                <div className="mb-6 flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Create Project
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Showcase your project and
                            share it with the SkillSync
                            community.
                        </p>
                    </div>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <label className="text-sm font-semibold text-slate-800">
                            Project Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            placeholder="Enter project title"
                            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                        />

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <label className="text-sm font-semibold text-slate-800">
                            Project Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Describe your project..."
                            rows={10}
                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-400"
                        />

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-sm font-semibold text-slate-800">
                                    Tech Stack
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add technologies used in your project.
                                </p>

                            </div>

                        </div>

                        <div className="mt-4 flex gap-2">

                            <input
                                type="text"
                                value={techStackInput}
                                onChange={(event) =>
                                    setTechStackInput(
                                        event.target.value
                                    )
                                }
                                onKeyDown={
                                    handleTechStackKeyDown
                                }
                                placeholder="React.js"
                                className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                            />

                            <button
                                type="button"
                                onClick={addTechStack}
                                className="flex items-center justify-center rounded-xl bg-slate-900 px-4 text-white transition hover:bg-slate-800"
                            >
                                <Plus size={18} />
                            </button>

                        </div>

                        {techStack.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">

                                {techStack.map(
                                    (tech) => (
                                        <div
                                            key={tech}
                                            className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700"
                                        >
                                            {tech}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTechStack(
                                                        tech
                                                    )
                                                }
                                                className="text-slate-400 transition hover:text-red-500"
                                            >
                                                <X
                                                    size={14}
                                                />
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-sm font-semibold text-slate-800">
                                    Project Links
                                </h2>

                                <p className="mt-1 text-xs text-slate-400">
                                    Add GitHub, Live Demo, Documentation or other useful links.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={addLink}
                                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            >
                                <Plus size={15} />
                                Add Link
                            </button>

                        </div>

                        <div className="mt-5 space-y-4">

                            {links.map(
                                (link, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl border border-slate-200 p-4"
                                    >

                                        <div className="flex items-center justify-between">

                                            <p className="text-xs font-semibold text-slate-600">
                                                Link{" "}
                                                {index + 1}
                                            </p>

                                            {links.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLink(
                                                            index
                                                        )
                                                    }
                                                    className="text-slate-400 transition hover:text-red-500"
                                                >
                                                    <Trash2
                                                        size={16}
                                                    />
                                                </button>
                                            )}

                                        </div>

                                        <div className="mt-3 grid gap-3 sm:grid-cols-[180px_1fr]">

                                            <input
                                                type="text"
                                                value={
                                                    link.title
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateLink(
                                                        index,
                                                        "title",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="GitHub"
                                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                                            />

                                            <input
                                                type="url"
                                                value={
                                                    link.url
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateLink(
                                                        index,
                                                        "url",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="https://github.com/..."
                                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                                            />

                                        </div>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <h2 className="text-sm font-semibold text-slate-800">
                            Project Media
                        </h2>

                        <div className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-1">

                            <button
                                type="button"
                                onClick={() =>
                                    setMediaType(
                                        "images"
                                    )
                                }
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    mediaType ===
                                    "images"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500"
                                }`}
                            >
                                Images
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setMediaType(
                                        "video"
                                    )
                                }
                                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                    mediaType ===
                                    "video"
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "text-slate-500"
                                }`}
                            >
                                Video
                            </button>

                        </div>

                        {mediaType ===
                            "images" && (
                            <div className="mt-5">

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-5 py-10 transition hover:border-slate-300">

                                    <Upload
                                        size={24}
                                        className="text-slate-400"
                                    />

                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        Upload project images
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        You can select multiple images
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={
                                            handleImages
                                        }
                                        className="hidden"
                                    />

                                </label>

                                {images.length >
                                    0 && (
                                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">

                                        {images.map(
                                            (
                                                image,
                                                index
                                            ) => (
                                                <div
                                                    key={`${image.name}-${index}`}
                                                    className="relative overflow-hidden rounded-xl bg-slate-100"
                                                >

                                                    <img
                                                        src={URL.createObjectURL(
                                                            image
                                                        )}
                                                        alt=""
                                                        className="h-32 w-full object-cover"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeImage(
                                                                index
                                                            )
                                                        }
                                                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
                                                    >
                                                        <X
                                                            size={14}
                                                        />
                                                    </button>

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>
                        )}

                        {mediaType ===
                            "video" && (
                            <div className="mt-5">

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-5 py-10 transition hover:border-slate-300">

                                    <Upload
                                        size={24}
                                        className="text-slate-400"
                                    />

                                    <p className="mt-3 text-sm font-medium text-slate-700">
                                        Upload project video
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Select one video file
                                    </p>

                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={
                                            handleVideo
                                        }
                                        className="hidden"
                                    />

                                </label>

                                {video && (
                                    <div className="mt-4 rounded-xl bg-slate-100 p-3">

                                        <div className="flex items-center justify-between">

                                            <p className="truncate text-sm font-medium text-slate-700">
                                                {video.name}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setVideo(
                                                        null
                                                    )
                                                }
                                                className="ml-3 text-slate-400 hover:text-red-500"
                                            >
                                                <X
                                                    size={18}
                                                />
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Project"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateProject;