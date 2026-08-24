import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Upload,
    X,
    Video,
} from "lucide-react";

const CreateShort = () => {
    const navigate = useNavigate();

    const [caption, setCaption] = useState("");
    const [video, setVideo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVideo = (event) => {
        const selectedVideo =
            event.target.files?.[0];

        if (!selectedVideo) {
            return;
        }

        if (
            !selectedVideo.type.startsWith(
                "video/"
            )
        ) {
            setError(
                "Please select a valid video file"
            );

            return;
        }

        setError("");
        setVideo(selectedVideo);
    };

    const removeVideo = () => {
        setVideo(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!video) {
            setError(
                "Please upload a video for your Short"
            );

            return;
        }

        const formData = new FormData();

        formData.append(
            "caption",
            caption.trim()
        );

        formData.append(
            "video",
            video
        );

        try {
            setLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/shorts/create",
                {
                    method: "POST",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to create Short"
                );
            }

            setSuccess(
                "Short created successfully"
            );

            setTimeout(() => {
                navigate("/shorts");
            }, 800);
        } catch (error) {
            console.error(error);

            setError(
                error.message ||
                    "Failed to create Short"
            );
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
                            Create Short
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Share a short video with
                            the DevNest community.
                        </p>
                    </div>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <label className="text-sm font-semibold text-slate-800">
                            Caption
                        </label>

                        <p className="mt-1 text-xs text-slate-400">
                            Tell the community what your
                            Short is about.
                        </p>

                        <textarea
                            value={caption}
                            onChange={(event) =>
                                setCaption(
                                    event.target.value
                                )
                            }
                            placeholder="Building something cool with MERN..."
                            rows={6}
                            className="mt-4 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-400"
                        />

                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">

                        <div>
                            <h2 className="text-sm font-semibold text-slate-800">
                                Short Video
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Upload the vertical video
                                you want to share.
                            </p>
                        </div>

                        {!video ? (
                            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 px-5 py-12 transition hover:border-violet-300 hover:bg-violet-50/30">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <Upload
                                        size={23}
                                    />
                                </div>

                                <p className="mt-4 text-sm font-semibold text-slate-700">
                                    Upload your Short
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Select one video file
                                </p>

                                <p className="mt-2 text-[11px] text-slate-400">
                                    Vertical videos are
                                    recommended
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
                        ) : (
                            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-black">

                                <div className="relative flex justify-center">

                                    <video
                                        src={URL.createObjectURL(
                                            video
                                        )}
                                        controls
                                        playsInline
                                        className="h-[500px] max-w-full object-contain sm:h-[600px]"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeVideo
                                        }
                                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
                                    >
                                        <X
                                            size={18}
                                        />
                                    </button>

                                </div>

                                <div className="flex items-center gap-3 border-t border-white/10 bg-white px-4 py-3">

                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                                        <Video
                                            size={18}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-sm font-medium text-slate-700">
                                            {video.name}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {(
                                                video.size /
                                                (1024 * 1024)
                                            ).toFixed(
                                                2
                                            )}{" "}
                                            MB
                                        </p>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            removeVideo
                                        }
                                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                                    >
                                        Remove
                                    </button>

                                </div>

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
                            disabled={
                                loading ||
                                !video
                            }
                            className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Creating..."
                                : "Create Short"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default CreateShort;