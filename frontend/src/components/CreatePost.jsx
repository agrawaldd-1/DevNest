import { useRef, useState } from "react";
import {
    Image,
    X,
    Send,
    LoaderCircle,
} from "lucide-react";

import { createPost } from "../services/postService.js";

const CreatePost = ({ onPostCreated }) => {
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB.");
            return;
        }

        setError("");
        setImage(file);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!caption.trim() && !image) {
            setError("Add a caption or image to create a post.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("caption", caption.trim());

            if (image) {
                formData.append("image", image);
            }

            const response = await createPost(formData);

            if (response.success) {
                setCaption("");
                setImage(null);
                setPreview("");

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }

                if (onPostCreated) {
                    onPostCreated(response.post);
                }
            }
        } catch (error) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                "Failed to create post."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto mb-8 w-full max-w-[520px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <form onSubmit={handleSubmit}>

                <div className="flex gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                        U
                    </div>

                    <textarea
                        value={caption}
                        onChange={(event) =>
                            setCaption(event.target.value)
                        }
                        placeholder="What's on your mind?"
                        rows={3}
                        className="min-h-[80px] w-full resize-none border-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    />

                </div>

                {preview && (
                    <div className="relative mt-3 overflow-hidden rounded-xl">

                        <img
                            src={preview}
                            alt="Post preview"
                            className="max-h-[360px] w-full object-cover"
                        />

                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                        >
                            <X size={17} />
                        </button>

                    </div>
                )}

                {error && (
                    <p className="mt-3 text-xs font-medium text-red-500">
                        {error}
                    </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">

                    <div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="post-image"
                        />

                        <label
                            htmlFor="post-image"
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-blue-600"
                        >
                            <Image size={19} />
                            Photo
                        </label>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                Post
                            </>
                        )}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default CreatePost;