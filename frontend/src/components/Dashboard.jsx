import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";

import { getProfile } from "../services/authServices.js";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import PostCard from "./PostCard.jsx";

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

                <Sidebar
                    user={user}
                    navigate={navigate}
                    handleLogout={handleLogout}
                />

                <main className="w-full lg:ml-[245px]">

                    <Navbar
                        navigate={navigate}
                        handleLogout={handleLogout}
                    />

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

                <MobileNav navigate={navigate} />

            </div>

        </div>
    );
};

export default Dashboard;