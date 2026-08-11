import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Download,
    Edit3,
    Globe,
    Link2,
    Mail,
} from "lucide-react";

import { fetchProfile } from "../services/profileService";
import defaultProfile from "../assets/default-profile.png";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";

const FetchProfile = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await fetchProfile();

                if (!data.success) {
                    setError(data.message || "Failed to fetch profile");
                    return;
                }

                setProfile(data.user);
            } catch (error) {
                console.error(error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/", { replace: true });
                    return;
                }

                setError(
                    error.response?.data?.message ||
                        "Something went wrong while fetching profile"
                );
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
                <div className="flex min-h-screen">
                    <Sidebar
                        user={null}
                        navigate={navigate}
                        handleLogout={handleLogout}
                    />

                    <main className="w-full lg:ml-[245px]">
                        

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 pb-24 lg:pb-10">
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

    if (error) {
        return (
            <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
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

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 pb-24 lg:pb-10">
                            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                                    !
                                </div>

                                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                    Unable to load profile
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
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

    if (!profile) {
        return null;
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

                    {/* <Navbar
                        navigate={navigate}
                        handleLogout={handleLogout}
                    /> */}

                    <div className="mx-auto max-w-[1080px] px-4 pb-28 pt-5 sm:px-6 lg:px-7 lg:pb-10 lg:pt-7">

                        

                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_285px]">

                            <section className="min-w-0">

                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#09061c] via-[#1b1248] to-[#5c45df] sm:h-40">
                                        <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />

                                        <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                                    </div>

                                    <div className="px-5 pb-6 sm:px-7">

                                        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 md:flex-row md:items-end md:justify-between">

                                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">

                                                <div className="relative shrink-0">
                                                    <img
                                                        src={
                                                            profile.image ||
                                                            defaultProfile
                                                        }
                                                        alt={`${profile.username}'s profile`}
                                                        className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-lg sm:h-32 sm:w-32"
                                                    />

                                                    <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
                                                </div>

                                                <div className="pb-1 text-center sm:text-left">

                                                    <h2 className="text-2xl font-bold text-slate-900">
                                                        {profile.username}
                                                    </h2>

                                                    

                                                </div>

                                            </div>

                                            <div className="flex w-full md:w-auto">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            "/profile/edit"
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:w-auto"
                                                >
                                                    <Edit3 size={15} />
                                                    Edit Profile
                                                </button>

                                            </div>

                                        </div>

                                        <div className="mt-5">
                                            <p className="max-w-2xl text-center text-sm leading-6 text-slate-600 sm:text-left">
                                                {profile.bio ||
                                                    "No Bio."}
                                            </p>
                                        </div>

                                        <div className="mt-6 grid grid-cols-4 border-t border-slate-100 pt-5">

                                            <div className="text-center">
                                                <p className="text-lg font-bold text-slate-900">
                                                    0
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Posts
                                                </p>
                                            </div>

                                            <div className="border-l border-slate-100 text-center">
                                                <p className="text-lg font-bold text-slate-900">
                                                    0
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Projects
                                                </p>
                                            </div>

                                            <div className="border-l border-slate-100 text-center">
                                                <p className="text-lg font-bold text-slate-900">
                                                    0
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Followers
                                                </p>
                                            </div>

                                            <div className="border-l border-slate-100 text-center">
                                                <p className="text-lg font-bold text-slate-900">
                                                    0
                                                </p>

                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Following
                                                </p>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                    <div className="grid grid-cols-5 overflow-x-auto border-b border-slate-100">

                                        <button
                                            type="button"
                                            className="relative whitespace-nowrap px-3 py-4 text-xs font-semibold text-violet-600 sm:text-sm"
                                        >
                                            Posts

                                            <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-violet-600" />
                                        </button>

                                        <button
                                            type="button"
                                            className="whitespace-nowrap px-3 py-4 text-xs text-slate-500 transition hover:text-slate-800 sm:text-sm"
                                        >
                                            Projects
                                        </button>

                                        <button
                                            type="button"
                                            className="whitespace-nowrap px-3 py-4 text-xs text-slate-500 transition hover:text-slate-800 sm:text-sm"
                                        >
                                            Shorts
                                        </button>

                                        <button
                                            type="button"
                                            className="whitespace-nowrap px-3 py-4 text-xs text-slate-500 transition hover:text-slate-800 sm:text-sm"
                                        >
                                            About
                                        </button>

                                        <button
                                            type="button"
                                            className="whitespace-nowrap px-3 py-4 text-xs text-slate-500 transition hover:text-slate-800 sm:text-sm"
                                        >
                                            Saved
                                        </button>

                                    </div>

                                    <div className="p-4 sm:p-6">

                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">

                                            <h3 className="text-sm font-semibold text-slate-800">
                                                Your posts will appear here
                                            </h3>

                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                                                Start sharing your projects,
                                                knowledge and ideas with the
                                                SkillSync community.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </section>

                            <aside>
                                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">
                                        <h2 className="text-base font-bold text-slate-900">
                                            Skills
                                        </h2>

                                        <span className="text-xs font-medium text-violet-600">
                                            {profile.skills?.length || 0}
                                        </span>
                                    </div>

                                    {profile.skills?.length > 0 ? (
                                        <div className="mt-5 space-y-4">

                                            {profile.skills.map(
                                                (skill, index) => (
                                                    <div
                                                        key={`${skill}-${index}`}
                                                    >
                                                        <div className="mb-1.5 flex items-center justify-between">

                                                            <span className="text-xs font-semibold text-slate-700">
                                                                {skill}
                                                            </span>

                                                            {/* <span className="text-[11px] text-slate-400">
                                                                {Math.max(
                                                                    60,
                                                                    90 -
                                                                        index *
                                                                            5
                                                                )}
                                                                %
                                                            </span> */}

                                                        </div>

                                                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                                                            {/* <div
                                                                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                                                                style={{
                                                                    width: `${Math.max(
                                                                        60,
                                                                        90 -
                                                                            index *
                                                                                5
                                                                    )}%`,
                                                                }}
                                                            /> */}

                                                        </div>
                                                    </div>
                                                )
                                            )}

                                        </div>
                                    ) : (
                                        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-7 text-center">
                                            <p className="text-xs text-slate-500">
                                                No skills added yet.
                                            </p>
                                        </div>
                                    )}

                                </section>
                            </aside>

                        </div>
                    </div>
                </main>

                <MobileNav navigate={navigate} />
            </div>
        </div>
    );
};

export default FetchProfile;