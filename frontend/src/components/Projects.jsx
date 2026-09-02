import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../components/ProjectCard.jsx";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";

const Projects = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const BASE_URL = import.meta.env.VITE_API_URL || "https://devnest-1-b73r.onrender.com";
            const response = await fetch(
                `${BASE_URL}/api/projects`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch projects"
                );
            }

            setProjects(data.projects || []);
        } catch (error) {
            console.error(error);

            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f7fb]">

                <div className="flex min-h-screen">

                    <Sidebar
                        user={null}
                        navigate={navigate}
                    />

                    <main className="w-full lg:ml-[245px]">

                        

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">

                            <p className="text-sm text-slate-500">
                                Loading projects...
                            </p>

                        </div>

                    </main>

                    <MobileNav navigate={navigate} />

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#f5f7fb]">

                <div className="flex min-h-screen">

                    <Sidebar
                        user={null}
                        navigate={navigate}
                    />

                    <main className="w-full lg:ml-[245px]">

                        <Navbar navigate={navigate} />

                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-4">

                            <div className="text-center">

                                <p className="text-sm text-red-500">
                                    {error}
                                </p>

                                <button
                                    type="button"
                                    onClick={fetchProjects}
                                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Try Again
                                </button>

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
                    user={null}
                    navigate={navigate}
                />

                <main className="w-full lg:ml-[245px]">

                    

                    <div className="px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">

                        <div className="mx-auto max-w-[900px]">

                            {/* Header */}

                            <div className="mb-8 flex items-center justify-between gap-4">

                                <div>

                                    <h1 className="text-2xl font-bold text-slate-900">
                                        Projects
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Discover projects built by developers on DevNest.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/projects/create"
                                        )
                                    }
                                    className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    <Plus size={18} />

                                    <span className="hidden sm:inline">
                                        Create Project
                                    </span>
                                </button>

                            </div>

                            {/* Projects */}

                            {projects.length === 0 ? (
                                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">

                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                        <Plus size={22} />
                                    </div>

                                    <h2 className="mt-4 text-base font-semibold text-slate-800">
                                        No projects yet
                                    </h2>

                                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                                        Be the first developer to showcase a project.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                "/projects/create"
                                            )
                                        }
                                        className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        Create Your Project
                                    </button>

                                </div>
                            ) : (
                                projects.map((project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                    />
                                ))
                            )}

                        </div>

                    </div>

                </main>

                <MobileNav navigate={navigate} />

            </div>

        </div>
    );
};

export default Projects;