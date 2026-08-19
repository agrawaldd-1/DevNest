import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Users, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProfile } from "../services/profileService";
import defaultProfile from "../assets/default-profile.png";
import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";
import Avatar from "./Avatar.jsx";

const FetchProfile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalProjects, setTotalProjects] = useState(0);
    const [totalShorts, setTotalShorts] = useState(0);
    const [totalConnections, setTotalConnections] = useState(0);
    const [activeTab, setActiveTab] = useState("posts");
    const [showNetwork, setShowNetwork] = useState(false);
    const [connections, setConnections] = useState([]);
    const [networkSearch, setNetworkSearch] = useState("");
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

                const data = await fetchProfile(userId);

                if (!data.success) {
                    setError(data.message || "Failed to fetch profile");
                    return;
                }

                setProfile(data.user);
                setPosts(data.posts || []);
                setProjects(data.projects || []);
                setShorts(data.shorts || []);
                setTotalPosts(data.totalPosts || 0);
                setTotalProjects(data.totalProjects || 0);
                setTotalShorts(data.totalShorts || 0);
                setTotalConnections(data.totalConnections || 0);
                setConnections(data.connections || []);
            } catch (error) {
                console.error(error);

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/", { replace: true });
                    return;
                }

                setError(error.response?.data?.message || "Something went wrong while fetching profile");
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate, userId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    const handlePostClick = (postId) => navigate(`/posts/${postId}`);
    const handleProjectClick = (projectId) => navigate(`/projects/${projectId}`);
    const handleShortClick = (shortId) => navigate(`/shorts/${shortId}`);

    const getConnectionUser = (connection) => {
        const profileId = profile?._id?.toString();
        const requesterId = connection?.requester?._id?.toString();

        return requesterId === profileId ? connection.recipient : connection.requester;
    };

    const filteredConnections = useMemo(() => {
        const search = networkSearch.trim().toLowerCase();

        if (!search) return connections;

        return connections.filter((connection) => {
            const user = getConnectionUser(connection);
            return user?.username?.toLowerCase().includes(search);
        });
    }, [connections, networkSearch, profile]);

    const closeNetwork = () => {
        setShowNetwork(false);
        setNetworkSearch("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
                <div className="flex min-h-screen">
                    <Sidebar user={null} navigate={navigate} handleLogout={handleLogout} />
                    <main className="w-full lg:ml-[245px]">
                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 pb-24 lg:pb-10">
                            <div className="text-center">
                                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />
                                <p className="mt-4 text-sm text-slate-500">Loading profile...</p>
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
                    <Sidebar user={null} navigate={navigate} handleLogout={handleLogout} />
                    <main className="w-full lg:ml-[245px]">
                        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5 pb-24 lg:pb-10">
                            <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">!</div>
                                <h2 className="mt-4 text-lg font-semibold text-slate-900">Unable to load profile</h2>
                                <p className="mt-2 text-sm text-slate-500">{error}</p>
                            </div>
                        </div>
                    </main>
                    <MobileNav navigate={navigate} />
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-900">
            <div className="flex min-h-screen">
                <Sidebar user={profile} navigate={navigate} handleLogout={handleLogout} />

                <main className="w-full lg:ml-[245px]">
                    <div className="mx-auto max-w-[1080px] px-4 pb-28 pt-5 sm:px-6 lg:px-7 lg:pb-10 lg:pt-7">
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-[#09061c] via-[#1b1248] to-[#5c45df] sm:h-40">
                                <div className="absolute -right-16 -top-28 h-72 w-72 rounded-full bg-violet-500/30 blur-3xl" />
                                <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
                            </div>

                            <div className="px-5 pb-6 sm:px-7">
                                <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 md:flex-row md:items-end md:justify-between">
                                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                                        <div className="relative shrink-0">
                                            <img src={profile.image || defaultProfile} alt={`${profile.username}'s profile`} className="h-28 w-28 rounded-full border-4 border-white bg-white object-cover shadow-lg sm:h-32 sm:w-32" />
                                            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
                                        </div>

                                        <div className="pb-1 text-center sm:text-left">
                                            <h2 className="text-2xl font-bold text-slate-900">{profile.username}</h2>
                                        </div>
                                    </div>

                                    <div className="flex w-full md:w-auto">
                                        <button type="button" onClick={() => navigate("/profile/edit")} className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 md:w-auto">
                                            <Edit3 size={15} />
                                            Edit Profile
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p className="max-w-3xl whitespace-pre-line text-center text-sm leading-6 text-slate-600 sm:text-left">{profile.bio || "No Bio."}</p>
                                </div>

                                <div className="mt-6 border-t border-slate-100 pt-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold text-slate-900">Skills</h3>
                                        <span className="text-xs font-semibold text-violet-600">{profile.skills?.length || 0}</span>
                                    </div>

                                    {profile.skills?.length > 0 ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {profile.skills.map((skill, index) => (
                                                <span key={`${skill}-${index}`} className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3.5 py-2 text-sm font-medium text-violet-700">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mt-4 rounded-xl bg-slate-50 px-4 py-5 text-center">
                                            <p className="text-xs text-slate-500">No skills added yet.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-4 border-t border-slate-100 pt-5">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-slate-900">{totalPosts}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">Posts</p>
                                    </div>

                                    <div className="border-l border-slate-100 text-center">
                                        <p className="text-lg font-bold text-slate-900">{totalProjects}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">Projects</p>
                                    </div>

                                    <div className="border-l border-slate-100 text-center">
                                        <p className="text-lg font-bold text-slate-900">{totalShorts}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">Shorts</p>
                                    </div>

                                    <button type="button" onClick={() => setShowNetwork(true)} className={`border-l border-slate-100 text-center transition hover:bg-slate-50 ${showNetwork ? "bg-violet-50" : ""}`}>
                                        <p className="text-lg font-bold text-slate-900">{totalConnections}</p>
                                        <p className={`mt-0.5 text-xs font-medium ${showNetwork ? "text-violet-600" : "text-slate-500"}`}>Network</p>
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="grid grid-cols-3 border-b border-slate-100">
                                {["posts", "projects", "shorts"].map((tab) => (
                                    <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`relative px-3 py-4 text-xs font-semibold transition sm:text-sm ${activeTab === tab ? "text-violet-600" : "text-slate-500 hover:text-slate-800"}`}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {activeTab === tab && <span className="absolute bottom-0 left-1/2 h-0.5 w-12 -translate-x-1/2 rounded-full bg-violet-600" />}
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 sm:p-6">
                                {activeTab === "posts" && (
                                    posts.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
                                            <h3 className="text-sm font-semibold text-slate-800">Your posts will appear here</h3>
                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">Start sharing your projects, knowledge and ideas with the SkillSync community.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {posts.map((post) => (
                                                <button key={post._id} type="button" onClick={() => handlePostClick(post._id)} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                                                    {post.image ? (
                                                        <img src={post.image} alt={post.caption || "Post"} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
                                                            <p className="line-clamp-4 text-xs font-medium text-slate-600">{post.caption}</p>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/20">
                                                        <span className="scale-90 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100">View Post</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )
                                )}

                                {activeTab === "projects" && (
                                    projects.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                                                <Plus size={22} />
                                            </div>
                                            <h3 className="mt-4 text-sm font-semibold text-slate-800">No projects yet</h3>
                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">Showcase your projects and let other developers discover your work.</p>
                                            <button type="button" onClick={() => navigate("/projects/create")} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800">Create Project</button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {projects.map((project) => (
                                                <button key={project._id} type="button" onClick={() => handleProjectClick(project._id)} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                                                    {project.mediaType === "images" && project.images?.length > 0 ? (
                                                        <img src={project.images[0]} alt={project.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                                                    ) : project.mediaType === "video" && project.video ? (
                                                        <video src={project.video} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 p-4">
                                                            <p className="line-clamp-4 text-center text-sm font-semibold text-slate-700">{project.title}</p>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/30">
                                                        <span className="scale-90 rounded-lg bg-black/70 px-4 py-2 text-xs font-semibold text-white opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100">View Project</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )
                                )}

                                {activeTab === "shorts" && (
                                    shorts.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
                                            <h3 className="text-sm font-semibold text-slate-800">No Shorts yet</h3>
                                            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">Share short-form developer content with the SkillSync community.</p>
                                            <button type="button" onClick={() => navigate("/shorts/create")} className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800">Create Short</button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                            {shorts.map((short) => (
                                                <button key={short._id} type="button" onClick={() => handleShortClick(short._id)} className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-black">
                                                    {short.video ? (
                                                        <video src={short.video} muted playsInline preload="metadata" className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-slate-200 p-4">
                                                            <p className="text-xs font-medium text-slate-600">Short</p>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                                    {short.caption && (
                                                        <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                                                            <p className="line-clamp-2 text-xs font-medium text-white">{short.caption}</p>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-200 group-hover:bg-black/20">
                                                        <span className="scale-90 rounded-lg bg-black/70 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100">View Short</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <MobileNav navigate={navigate} />
            </div>

            {showNetwork && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]" onClick={closeNetwork}>
                    <div className="w-full max-w-[650px] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">My Network</h2>
                                <p className="mt-0.5 text-xs text-slate-500">{totalConnections} connection{totalConnections !== 1 ? "s" : ""}</p>
                            </div>

                            <button type="button" onClick={closeNetwork} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="border-b border-slate-100 px-5 py-3">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-100 px-4 py-2.5">
                                <Search size={18} className="shrink-0 text-slate-400" />
                                <input type="text" value={networkSearch} onChange={(event) => setNetworkSearch(event.target.value)} placeholder="Search" className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400" />
                            </div>
                        </div>

                        <div className="max-h-[480px] overflow-y-auto px-5 py-2">
                            {filteredConnections.length === 0 ? (
                                <div className="py-14 text-center">
                                    <Users size={30} className="mx-auto text-slate-300" />
                                    <p className="mt-3 text-sm font-semibold text-slate-600">{networkSearch ? "No connection found" : "No connections yet"}</p>
                                </div>
                            ) : (
                                filteredConnections.map((connection) => {
                                    const user = getConnectionUser(connection);

                                    if (!user) return null;

                                    return (
                                        <div key={connection._id} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
                                            <button type="button" onClick={() => { closeNetwork(); navigate(`/profile/${user._id}`); }} className="flex min-w-0 items-center gap-3 text-left">
                                                <Avatar username={user.username} image={user.image} />
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{user.username}</p>
                                                    <p className="truncate text-xs text-slate-500">Connected</p>
                                                </div>
                                            </button>

                                            <span className="ml-4 shrink-0 rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Connected</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FetchProfile;