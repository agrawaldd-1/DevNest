import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Mail, Code2, ArrowRight } from "lucide-react";
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

                    <p className="text-sm text-slate-400">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
                <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
            </div>

            <header className="relative border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
                            <Code2 size={21} />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight">
                                SkillSync
                            </h1>

                            <p className="hidden text-xs text-slate-500 sm:block">
                                Build Skills. Build Network. Build Career.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                    >
                        <LogOut size={17} />
                        <span className="hidden sm:inline">
                            Logout
                        </span>
                    </button>
                </div>
            </header>

            <main className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8">
                <section className="mb-8">
                    <p className="mb-2 text-sm font-medium text-blue-400">
                        Dashboard
                    </p>

                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Welcome back, {user?.username}
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                        Manage your developer profile, showcase your skills,
                        and grow your professional network.
                    </p>
                </section>

                <section className="grid gap-6 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl lg:col-span-2">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Your Profile
                                </p>

                                <h3 className="mt-1 text-xl font-semibold">
                                    {user?.username}
                                </h3>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                <User size={22} />
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                    <User size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500">
                                        Username
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium text-slate-200">
                                        {user?.username}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                                    <Mail size={18} />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-slate-500">
                                        Email
                                    </p>

                                    <p className="mt-1 truncate text-sm font-medium text-slate-200">
                                        {user?.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400">
                            Complete Your Profile
                            <ArrowRight size={17} />
                        </button>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                            <Code2 size={22} />
                        </div>

                        <h3 className="mt-6 text-xl font-semibold">
                            Build your profile
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-slate-400">
                            Add your skills, bio, projects and experience to
                            create a strong developer identity.
                        </p>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-4 py-3">
                                <span className="text-sm text-slate-400">
                                    Skills
                                </span>

                                <span className="text-xs text-slate-600">
                                    Coming soon
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-4 py-3">
                                <span className="text-sm text-slate-400">
                                    Projects
                                </span>

                                <span className="text-xs text-slate-600">
                                    Coming soon
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-4 py-3">
                                <span className="text-sm text-slate-400">
                                    Network
                                </span>

                                <span className="text-xs text-slate-600">
                                    Coming soon
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;