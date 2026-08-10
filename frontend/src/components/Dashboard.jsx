import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    LogOut,
    Home,
    User,
    FolderKanban,
    Clapperboard,
    MessageSquare,
    Search,
    PenSquare,
    Code2,
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
} from "lucide-react";

import { getProfile } from "../services/authServices.js";

const Dashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/", { replace: true });
                return;
            }

            try {
                const response = await getProfile(token);

                if (response.success) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error(error);

                localStorage.removeItem("token");
                navigate("/", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20">
                        <Code2 size={26} className="text-white" />
                    </div>

                    <p className="mt-4 text-sm text-slate-400">
                        Loading SkillSync...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-900">

            <div className="flex min-h-screen">

                <aside className="fixed inset-y-0 left-0 z-50 hidden w-[245px] flex-col border-r border-slate-800/80 bg-[#0b1220] lg:flex">

                    <div className="border-b border-white/5 px-5 py-5">
                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-600/20">
                                <Code2
                                    size={21}
                                    className="text-white"
                                />
                            </div>

                            <div>
                                <h1 className="text-[17px] font-bold tracking-tight text-white">
                                    SkillSync
                                </h1>

                                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-500">
                                    Developer Network
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="flex-1 px-3 py-6">

                        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                            Workspace
                        </p>

                        <nav className="space-y-1">

                            <SidebarItem
                                icon={<Home size={19} />}
                                label="Home"
                                active
                                onClick={() => navigate("/dashboard")}
                            />

                            <SidebarItem
                                icon={<Search size={19} />}
                                label="Search"
                                onClick={() => navigate("/search")}
                            />

                            <SidebarItem
                                icon={<User size={19} />}
                                label="Profile"
                                onClick={() => navigate("/profile")}
                            />

                            <SidebarItem
                                icon={<FolderKanban size={19} />}
                                label="Projects"
                                onClick={() => navigate("/projects")}
                            />

                            <SidebarItem
                                icon={<Clapperboard size={19} />}
                                label="Shorts"
                                onClick={() => navigate("/shorts")}
                            />

                            <SidebarItem
                                icon={<MessageSquare size={19} />}
                                label="Chat"
                                onClick={() => navigate("/chat")}
                            />

                        </nav>
                    </div>

                    <div className="border-t border-white/5 p-3">

                        <div className="flex items-center gap-3 rounded-xl bg-white/[0.035] p-3">

                            <Avatar
                                username={user?.username}
                                image={user?.image}
                            />

                            <div className="min-w-0 flex-1">

                                <p className="truncate text-sm font-semibold text-white">
                                    {user?.username}
                                </p>

                                <p className="truncate text-[11px] text-slate-500">
                                    {user?.email}
                                </p>

                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-500/10 hover:text-red-400"
                                title="Logout"
                            >
                                <LogOut size={17} />
                            </button>

                        </div>

                    </div>

                </aside>

                <main className="w-full lg:ml-[245px]">

                    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f5f7fb]/95 backdrop-blur-xl">

                        <div className="mx-auto flex h-[72px] max-w-[1080px] items-center justify-between px-5 sm:px-7">

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    Your workspace
                                </p>

                                <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                    Home
                                </h2>
                            </div>

                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() => navigate("/create-post")}
                                    className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30 sm:flex"
                                >
                                    <PenSquare size={17} />
                                    Create Post
                                </button>

                                <button
                                    className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                                >
                                    <Bell size={19} />

                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    <LogOut size={17} />

                                    <span className="hidden sm:block">
                                        Logout
                                    </span>
                                </button>

                            </div>

                        </div>

                    </header>

                    <div className="mx-auto max-w-[1080px] px-5 pb-28 pt-8 sm:px-7 lg:pb-10">

                        <div className="mb-7 flex items-end justify-between">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">
                                    Community
                                </p>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                                    Latest from developers
                                </h1>
                            </div>

                            <button
                                onClick={() => navigate("/search")}
                                className="hidden text-sm font-semibold text-slate-500 transition hover:text-blue-600 sm:block"
                            >
                                Explore feed
                            </button>

                        </div>

                        <section>

                            <PostCard
                                username="SkillSync Community"
                                time="Just now"
                                title="Welcome to SkillSync 🚀"
                                description="Build your skills, showcase your projects and connect with developers who share your interests."
                                avatar="S"
                                verified
                            />

                            <PostCard
                                username="Developer Community"
                                time="2 hours ago"
                                title="Share what you're building"
                                description="Your projects tell your story. Let the community discover what you can build, learn from your journey and connect with developers working on similar ideas."
                                avatar="D"
                            />

                            <PostCard
                                username="SkillSync"
                                time="Yesterday"
                                title="Build Skills. Build Network. Build Career."
                                description="SkillSync brings developers together around skills, projects and meaningful connections. Start building your developer network today."
                                avatar="S"
                                verified
                            />

                        </section>

                    </div>

                </main>

                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-[0_-5px_25px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">

                    <div className="mx-auto flex max-w-md items-center justify-around">

                        <MobileNavItem
                            icon={<Home size={19} />}
                            label="Home"
                            active
                            onClick={() => navigate("/dashboard")}
                        />

                        <MobileNavItem
                            icon={<Search size={19} />}
                            label="Search"
                            onClick={() => navigate("/search")}
                        />

                        <button
                            onClick={() => navigate("/create-post")}
                            className="flex h-12 w-12 -translate-y-4 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-600/30 transition active:scale-95"
                        >
                            <PenSquare size={20} />
                        </button>

                        <MobileNavItem
                            icon={<MessageSquare size={19} />}
                            label="Chat"
                            onClick={() => navigate("/chat")}
                        />

                        <MobileNavItem
                            icon={<User size={19} />}
                            label="Profile"
                            onClick={() => navigate("/profile")}
                        />

                    </div>

                </div>

            </div>
        </div>
    );
};

const SidebarItem = ({
    icon,
    label,
    active = false,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition ${
                active
                    ? "bg-blue-500/10 font-semibold text-blue-400"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
            }`}
        >
            <span
                className={`transition ${
                    active
                        ? "text-blue-400"
                        : "text-slate-500 group-hover:text-slate-300"
                }`}
            >
                {icon}
            </span>

            <span>{label}</span>

            {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />
            )}
        </button>
    );
};

const MobileNavItem = ({
    icon,
    label,
    active = false,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`flex min-w-[52px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition ${
                active
                    ? "text-blue-600"
                    : "text-slate-400 hover:text-slate-700"
            }`}
        >
            {icon}

            <span>{label}</span>
        </button>
    );
};

const Avatar = ({
    username = "",
    image,
}) => {
    if (image) {
        return (
            <img
                src={image}
                alt={username}
                className="h-10 w-10 shrink-0 rounded-xl object-cover"
            />
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
            {username?.charAt(0)?.toUpperCase() || "U"}
        </div>
    );
};

const PostCard = ({
    username,
    time,
    title,
    description,
    avatar,
    verified = false,
}) => {
    return (
        <article className="group mb-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">

            <div className="p-5 sm:p-6">

                <div className="flex items-start justify-between">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 text-sm font-bold text-white">
                            {avatar}
                        </div>

                        <div className="min-w-0">

                            <div className="flex items-center gap-1.5">

                                <h3 className="truncate text-sm font-bold text-slate-900">
                                    {username}
                                </h3>

                                {verified && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                                        ✓
                                    </span>
                                )}

                            </div>

                            <p className="mt-0.5 text-xs text-slate-400">
                                {time}
                            </p>

                        </div>

                    </div>

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal size={19} />
                    </button>

                </div>

                <div className="mt-5">

                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {description}
                    </p>

                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                    <div className="flex items-center gap-1">

                        <PostAction
                            icon={<Heart size={17} />}
                            label="Like"
                        />

                        <PostAction
                            icon={<MessageCircle size={17} />}
                            label="Comment"
                        />

                        <PostAction
                            icon={<Share2 size={17} />}
                            label="Share"
                        />

                    </div>

                    <button className="text-xs font-semibold text-slate-400 transition hover:text-blue-600">
                        View post
                    </button>

                </div>

            </div>

        </article>
    );
};

const PostAction = ({
    icon,
    label,
}) => {
    return (
        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-blue-600">
            {icon}

            <span className="hidden sm:inline">
                {label}
            </span>
        </button>
    );
};

export default Dashboard;