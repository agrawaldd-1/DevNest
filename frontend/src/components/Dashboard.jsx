import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";

import { getProfile } from "../services/authServices.js";
import { getAllPosts } from "../services/postService.js";

import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import MobileNav from "./MobileNav.jsx";
import PostCard from "./PostCard.jsx";

const Dashboard = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const observerRef = useRef(null);

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setPostsLoading(true);

                const response = await getAllPosts(1);

                if (response.success) {
                    setPosts(response.posts);
                    setHasMore(response.hasMore);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (page === 1 || !hasMore) {
            return;
        }

        const fetchMorePosts = async () => {
            try {
                setLoadingMore(true);

                const response = await getAllPosts(page);

                if (response.success) {
                    setPosts((previousPosts) => [
                        ...previousPosts,
                        ...response.posts,
                    ]);

                    setHasMore(response.hasMore);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingMore(false);
            }
        };

        fetchMorePosts();
    }, [page, hasMore]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loadingMore &&
                    !postsLoading
                ) {
                    setPage((previousPage) => previousPage + 1);
                }
            },
            {
                threshold: 0.1,
            }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMore, loadingMore, postsLoading]);

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

                    <div className="mx-auto px-5 pb-28 pt-8 sm:px-7 lg:pb-10">

                        <section>

                            {postsLoading ? (
                                <div className="py-10 text-center text-sm text-slate-400">
                                    Loading posts...
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="text-sm font-medium text-slate-500">
                                        No posts found.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Be the first one to create a post.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {posts.map((post) => (
                                        <PostCard
                                            key={post._id}
                                            post={post}
                                        />
                                    ))}

                                    <div
                                        ref={observerRef}
                                        className="flex h-20 items-center justify-center"
                                    >
                                        {loadingMore && (
                                            <p className="text-sm text-slate-400">
                                                Loading more posts...
                                            </p>
                                        )}

                                        {!hasMore && (
                                            <p className="text-sm text-slate-400">
                                                You're all caught up.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                        </section>

                    </div>

                </main>

                <MobileNav navigate={navigate} />

            </div>

        </div>
    );
};

export default Dashboard;