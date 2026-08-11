import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Camera,
    Check,
    ChevronDown,
    X,
} from "lucide-react";

import { fetchProfile, editProfile } from "../services/profileService.js";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";

import defaultProfile from "../assets/default-profile.png";

const availableSkills = [
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "Go",
    "Rust",
    "PHP",
    "Kotlin",
    "Swift",
    "HTML",
    "CSS",
    "SASS",
    "Tailwind",
    "Bootstrap",
    "React",
    "Next.js",
    "Vue",
    "Angular",
    "Node.js",
    "Express",
    "NestJS",
    "Spring Boot",
    "Django",
    "Flask",
    "FastAPI",
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "Redis",
    "SQLite",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Nginx",
    "Linux",
    "REST API",
    "GraphQL",
    "Socket.IO",
    "JWT",
    "OAuth",
    "Git",
    "GitHub",
    "CI/CD",
    "System Design",
    "DSA",
    "Microservices",
    "Testing",
    "Performance",
];

const EditProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [profile, setProfile] = useState(null);

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState([]);

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [skillSearch, setSkillSearch] = useState("");
    const [showSkills, setShowSkills] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                const data = await fetchProfile();

                if (!data.success) {
                    setError(data.message || "Failed to fetch profile");
                    return;
                }

                const user = data.user;

                setProfile(user);
                setUsername(user.username || "");
                setBio(user.bio || "");
                setSkills(user.skills || []);

                setImagePreview(
                    user.image || defaultProfile
                );
            } catch (error) {
                console.error(error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/", { replace: true });
                    return;
                }

                setError(
                    error.response?.data?.message ||
                        "Something went wrong while loading profile"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handleImageChange = (event) => {
        const selectedImage = event.target.files?.[0];

        if (!selectedImage) {
            return;
        }

        if (!selectedImage.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (selectedImage.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB.");
            return;
        }

        setError("");
        setSuccess("");

        setImage(selectedImage);

        const previewUrl = URL.createObjectURL(selectedImage);
        setImagePreview(previewUrl);
    };

    const handleSkillToggle = (skill) => {
        setSkills((currentSkills) => {
            if (currentSkills.includes(skill)) {
                return currentSkills.filter(
                    (currentSkill) => currentSkill !== skill
                );
            }

            return [...currentSkills, skill];
        });
    };

    const removeSkill = (skill) => {
        setSkills((currentSkills) =>
            currentSkills.filter(
                (currentSkill) => currentSkill !== skill
            )
        );
    };

    const filteredSkills = availableSkills.filter((skill) =>
        skill.toLowerCase().includes(skillSearch.toLowerCase())
    );

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!username.trim()) {
            setError("Username is required.");
            return;
        }

        if (skills.length === 0) {
            setError("Please select at least one skill.");
            return;
        }

        try {
            setSaving(true);

            const formData = new FormData();

            formData.append("username", username.trim());
            formData.append("bio", bio.trim());
            formData.append("skills", JSON.stringify(skills));

            if (image) {
                formData.append("image", image);
            }

            const data = await editProfile(formData);

            if (!data.success) {
                setError(data.message || "Failed to update profile");
                return;
            }

            setSuccess("Profile updated successfully.");

            setProfile(data.user);

            if (data.user.image) {
                setImagePreview(data.user.image);
            }

            setImage(null);

            setTimeout(() => {
                navigate("/profile");
            }, 700);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                    "Something went wrong while updating profile"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f7fb]">
                <div className="flex min-h-screen">
                    <Sidebar
                        user={null}
                        navigate={navigate}
                        handleLogout={handleLogout}
                    />

                    <main className="w-full lg:ml-[245px]">
                        <Navbar
                            navigate={navigate}
                            handleLogout={handleLogout}
                        />

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

                                <p className="mt-4 text-sm text-slate-500">
                                    Loading profile...
                                </p>
                            </div>
                        </div>
                    </main>

                    <MobileNav navigate={navigate} />
                </div>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="min-h-screen bg-[#f5f7fb]">
                <div className="flex min-h-screen">
                    <Sidebar
                        user={null}
                        navigate={navigate}
                        handleLogout={handleLogout}
                    />

                    <main className="w-full lg:ml-[245px]">
                        <Navbar
                            navigate={navigate}
                            handleLogout={handleLogout}
                        />

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
                            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                                <p className="text-sm text-red-500">
                                    {error}
                                </p>
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
                    user={profile}
                    navigate={navigate}
                    handleLogout={handleLogout}
                />

                <main className="w-full lg:ml-[245px]">

                    <Navbar
                        navigate={navigate}
                        handleLogout={handleLogout}
                    />

                    <div className="mx-auto max-w-[900px] px-4 pb-28 pt-5 sm:px-6 lg:px-7 lg:pb-10 lg:pt-7">

                        <div className="mb-5 flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() => navigate("/profile")}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                            >
                                <ArrowLeft size={17} />
                            </button>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
                                    Profile
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    Edit Profile
                                </h1>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div className="relative h-32 bg-gradient-to-br from-[#09061c] via-[#1b1248] to-[#5c45df] sm:h-40">
                                    <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />

                                    <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                                </div>

                                <div className="px-5 pb-7 sm:px-8">

                                    <div className="-mt-14 flex flex-col items-center sm:-mt-16">

                                        <div className="relative">

                                            <img
                                                src={
                                                    imagePreview ||
                                                    defaultProfile
                                                }
                                                alt="Profile"
                                                className="h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-md transition hover:bg-violet-700"
                                            >
                                                <Camera size={17} />
                                            </button>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />

                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            JPG, PNG or WEBP · Max 5MB
                                        </p>

                                    </div>

                                    <div className="mt-8 grid grid-cols-1 gap-6">

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                                Username
                                            </label>

                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(event) =>
                                                    setUsername(
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Enter your username"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                                Bio
                                            </label>

                                            <textarea
                                                value={bio}
                                                onChange={(event) =>
                                                    setBio(
                                                        event.target.value
                                                    )
                                                }
                                                rows={4}
                                                maxLength={250}
                                                placeholder="Tell the community about yourself..."
                                                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                            />

                                            <div className="mt-1 text-right text-[11px] text-slate-400">
                                                {bio.length}/250
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-800">
                                                Skills
                                            </label>

                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

                                                <div className="flex flex-wrap gap-2">

                                                    {skills.map((skill) => (
                                                        <span
                                                            key={skill}
                                                            className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700"
                                                        >
                                                            {skill}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeSkill(
                                                                        skill
                                                                    )
                                                                }
                                                                className="rounded-full p-0.5 transition hover:bg-violet-200"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </span>
                                                    ))}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setShowSkills(
                                                                !showSkills
                                                            )
                                                        }
                                                        className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-violet-400 hover:text-violet-600"
                                                    >
                                                        Add Skill
                                                        <ChevronDown
                                                            size={13}
                                                        />
                                                    </button>

                                                </div>

                                                {showSkills && (
                                                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                                                        <div className="border-b border-slate-100 p-3">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    skillSearch
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setSkillSearch(
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Search skills..."
                                                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
                                                            />
                                                        </div>

                                                        <div className="max-h-60 overflow-y-auto p-2">

                                                            {filteredSkills.length >
                                                            0 ? (
                                                                filteredSkills.map(
                                                                    (
                                                                        skill
                                                                    ) => {
                                                                        const selected =
                                                                            skills.includes(
                                                                                skill
                                                                            );

                                                                        return (
                                                                            <button
                                                                                type="button"
                                                                                key={
                                                                                    skill
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSkillToggle(
                                                                                        skill
                                                                                    )
                                                                                }
                                                                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                                                                                    selected
                                                                                        ? "bg-violet-50 text-violet-700"
                                                                                        : "text-slate-600 hover:bg-slate-50"
                                                                                }`}
                                                                            >
                                                                                <span>
                                                                                    {
                                                                                        skill
                                                                                    }
                                                                                </span>

                                                                                {selected && (
                                                                                    <Check
                                                                                        size={
                                                                                            15
                                                                                        }
                                                                                    />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <p className="px-3 py-6 text-center text-xs text-slate-400">
                                                                    No skills
                                                                    found
                                                                </p>
                                                            )}

                                                        </div>

                                                    </div>
                                                )}

                                            </div>

                                            <p className="mt-2 text-xs text-slate-400">
                                                Select the skills you want to
                                                showcase on your profile.
                                            </p>
                                        </div>

                                    </div>

                                    {error && (
                                        <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                                            <p className="text-xs font-medium text-red-600">
                                                {error}
                                            </p>
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                                            <p className="text-xs font-medium text-emerald-600">
                                                {success}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate("/profile")
                                            }
                                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {saving
                                                ? "Saving Changes..."
                                                : "Save Changes"}
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                <MobileNav navigate={navigate} />
            </div>
        </div>
    );
};

export default EditProfile;