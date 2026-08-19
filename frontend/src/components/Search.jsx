import { useEffect, useState } from "react";
import { Search as SearchIcon, UserRound, FolderKanban, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";

const Search = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [developers, setDevelopers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (query.trim()) {
                handleSearch(query.trim());
            } else {
                setDevelopers([]);
                setProjects([]);
                setSearched(false);
                setError("");
            }
        }, 400);

        return () => clearTimeout(searchTimeout);
    }, [query]);

    const handleSearch = async (searchQuery) => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/search?query=${encodeURIComponent(searchQuery)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setDevelopers([]);
                setProjects([]);
                setSearched(true);
                setError(data.message || "No results found");
                return;
            }

            if (data.type === "developer") {
                setDevelopers(data.developers || []);
                setProjects([]);
            } else if (data.type === "project") {
                setProjects(data.projects || []);
                setDevelopers([]);
            }

            setSearched(true);
        } catch (error) {
            console.error("Search error:", error);
            setError("Something went wrong while searching");
            setDevelopers([]);
            setProjects([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setDevelopers([]);
        setProjects([]);
        setSearched(false);
        setError("");
    };

    const getInitial = (username = "") => {
        return username.charAt(0).toUpperCase();
    };

    const visibleDevelopers =
        activeTab === "projects" ? [] : developers;

    const visibleProjects =
        activeTab === "developers" ? [] : projects;

    const hasResults =
        visibleDevelopers.length > 0 || visibleProjects.length > 0;

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
            <Sidebar user={null} navigate={navigate} />

            {/* <main className="w-full lg:ml-[245px]"> */}
            <main className="min-w-0 flex-1 lg:ml-[245px]">

                <div className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-8">
                    <div className="mx-auto max-w-[1200px]">
                        <div className="mb-8">
                            <p className="mb-2 text-sm font-medium text-slate-400">
                                Discover
                            </p>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Search & Discovery
                            </h1>

                            <p className="mt-3 text-base text-slate-500 sm:text-lg">
                                Find developers, explore projects and discover skills across SkillSync.
                            </p>
                        </div>

                        <div className="relative">
                            <SearchIcon
                                size={25}
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search developers or type #skill..."
                                className="h-[76px] w-full rounded-2xl border border-slate-200 bg-white pl-16 pr-14 text-lg text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            />

                            {query && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    <X size={22} />
                                </button>
                            )}
                        </div>

                        {!query && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                                <span>Try:</span>

                                <button
                                    type="button"
                                    onClick={() => setQuery("react")}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-500"
                                >
                                    react
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setQuery("#react")}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-500"
                                >
                                    #react
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setQuery("#javascript")}
                                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-500 transition hover:border-indigo-200 hover:text-indigo-500"
                                >
                                    #javascript
                                </button>
                            </div>
                        )}

                        {query && (
                            <div className="mt-5 flex items-center gap-3 text-sm text-slate-500">
                                <SearchIcon size={18} className="text-indigo-500" />
                                <span>
                                    {loading
                                        ? "Searching..."
                                        : query.startsWith("#")
                                            ? "Searching projects"
                                            : "Searching developers"}
                                </span>
                            </div>
                        )}

                        <div className="mt-8 border-b border-slate-200">
                            <div className="flex gap-8">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("all")}
                                    className={`flex items-center gap-2 border-b-2 px-2 pb-4 text-base font-medium transition ${activeTab === "all"
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    All
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab("developers")}
                                    className={`flex items-center gap-2 border-b-2 px-2 pb-4 text-base font-medium transition ${activeTab === "developers"
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <UserRound size={19} />
                                    Developers
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveTab("projects")}
                                    className={`flex items-center gap-2 border-b-2 px-2 pb-4 text-base font-medium transition ${activeTab === "projects"
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-slate-500 hover:text-slate-800"
                                        }`}
                                >
                                    <FolderKanban size={19} />
                                    Projects
                                </button>
                            </div>
                        </div>

                        {!searched && !query && (
                            <div className="mt-8 flex min-h-[380px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                                <div className="max-w-xl px-6 text-center">
                                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
                                        <SearchIcon size={38} />
                                    </div>

                                    <h2 className="mt-7 text-2xl font-bold text-slate-900">
                                        Start discovering
                                    </h2>

                                    <p className="mt-3 text-base leading-7 text-slate-500">
                                        Search for a developer by username or use{" "}
                                        <span className="font-semibold text-purple-600">
                                            #skill
                                        </span>{" "}
                                        to discover projects using a specific technology.
                                    </p>
                                </div>
                            </div>
                        )}

                        {searched && (
                            <div className="mt-8">
                                {loading ? (
                                    <div className="py-16 text-center text-sm text-slate-500">
                                        Searching...
                                    </div>
                                ) : error || !hasResults ? (
                                    <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                            <SearchIcon size={28} />
                                        </div>

                                        <h2 className="mt-5 text-xl font-semibold text-slate-900">
                                            No results found
                                        </h2>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Try searching with another developer username or skill.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-5">
                                            <h2 className="text-xl font-semibold text-slate-900">
                                                Search Results
                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {activeTab === "projects"
                                                    ? `${visibleProjects.length} projects found`
                                                    : activeTab === "developers"
                                                        ? `${visibleDevelopers.length} developers found`
                                                        : `${visibleDevelopers.length + visibleProjects.length} results found`}
                                            </p>
                                        </div>

                                        {visibleDevelopers.length > 0 && (
                                            <div className="space-y-4">
                                                {visibleDevelopers.map((developer) => (
                                                    <div
                                                        key={developer._id}
                                                        className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-6"
                                                    >
                                                        <div className="flex min-w-0 items-center gap-4">
                                                            {developer.image ? (
                                                                <img
                                                                    src={developer.image}
                                                                    alt={developer.username}
                                                                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xl font-bold text-white">
                                                                    {getInitial(developer.username)}
                                                                </div>
                                                            )}

                                                            <div className="min-w-0">
                                                                <h3 className="truncate text-lg font-semibold text-slate-900">
                                                                    {developer.username}
                                                                </h3>

                                                                <p className="mt-1 text-sm text-slate-400">
                                                                    Developer on SkillSync
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                navigate(`/profile/${developer._id}`)
                                                            }
                                                            className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                                                        >
                                                            <span className="hidden sm:inline">
                                                                View
                                                            </span>
                                                            <ArrowRight size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {visibleProjects.length > 0 && (
                                            <div className="space-y-5">
                                                {visibleProjects.map((project) => (
                                                    <div
                                                        key={project._id}
                                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                                                    >
                                                        <div className="flex min-h-[190px] items-center justify-center bg-gradient-to-br from-[#111936] to-[#4b087d]">
                                                            <span className="text-5xl font-light text-white/70">
                                                                &lt;/&gt;
                                                            </span>
                                                        </div>

                                                        <div className="p-6">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="min-w-0">
                                                                    <h3 className="text-xl font-semibold text-slate-900">
                                                                        {project.title}
                                                                    </h3>

                                                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                                                                        {project.description}
                                                                    </p>
                                                                </div>

                                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                                    <FolderKanban size={21} />
                                                                </div>
                                                            </div>

                                                            {project.techStack?.length > 0 && (
                                                                <div className="mt-5 flex flex-wrap gap-2">
                                                                    {project.techStack
                                                                        .slice(0, 6)
                                                                        .map((skill, index) => (
                                                                            <span
                                                                                key={index}
                                                                                className="rounded-full bg-purple-50 px-4 py-2 text-xs font-medium text-purple-600"
                                                                            >
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                </div>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    navigate(`/projects/${project._id}`)
                                                                }
                                                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                                                            >
                                                                View Project
                                                                <ArrowRight size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <MobileNav navigate={navigate} />
        </div>
    );
};

export default Search;