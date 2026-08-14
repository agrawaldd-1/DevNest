import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar.jsx";
import MobileNav from "./MobileNav.jsx";

import ShortCard from "../components/ShortCard.jsx";

import { getAllShorts } from "../services/shortService.js";

const Shorts = () => {
    const navigate = useNavigate();

    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchShorts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllShorts();

            if (response.success) {
                setShorts(response.shorts || []);
            }
        } catch (error) {
            console.error(error);

            setError(
                error?.response?.data?.message ||
                    "Failed to fetch shorts"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShorts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white">

                <Sidebar
                    user={null}
                    navigate={navigate}
                />

                <main className="min-h-screen lg:ml-[245px]">

                    <div className="flex min-h-screen items-center justify-center">

                        <p className="text-sm text-slate-400">
                            Loading Shorts...
                        </p>

                    </div>

                </main>

                <MobileNav
                    navigate={navigate}
                />

            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">

                <Sidebar
                    user={null}
                    navigate={navigate}
                />

                <main className="min-h-screen lg:ml-[245px]">

                    <div className="flex min-h-screen items-center justify-center px-4">

                        <div className="text-center">

                            <p className="text-sm text-red-400">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={fetchShorts}
                                className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-200"
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                </main>

                <MobileNav
                    navigate={navigate}
                />

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">

            <Sidebar
                user={null}
                navigate={navigate}
            />

            <main className="min-h-screen lg:ml-[245px]">

                <div className="relative h-screen">

                    {/* Create Short Button */}

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/shorts/create"
                            )
                        }
                        className="
                            fixed
                            left-4 top-4
                            lg:bottom-7 lg:right-7
                            lg:left-auto lg:top-auto
                            z-40
                            flex items-center gap-2
                            rounded-full
                            bg-violet-600
                            px-5 py-3
                            text-sm font-semibold
                            text-white
                            shadow-xl
                            transition
                            hover:bg-violet-700
                        "
                    >
                        <Plus size={19} />

                        <span>
                            Create Short
                        </span>
                    </button>

                    {/* Shorts */}

                    {shorts.length === 0 ? (

                        <div className="flex h-screen items-center justify-center px-4 text-center text-white">

                            <div>

                                <h2 className="text-lg font-semibold">
                                    No Shorts yet
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Be the first developer to
                                    upload a Short.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/shorts/create"
                                        )
                                    }
                                    className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-slate-200"
                                >
                                    Create Short
                                </button>

                            </div>

                        </div>

                    ) : (

                        <div className="h-screen snap-y snap-mandatory overflow-y-auto overscroll-contain scrollbar-hide">

                            {shorts.map(
                                (short) => (
                                    <ShortCard
                                        key={
                                            short._id
                                        }
                                        short={
                                            short
                                        }
                                    />
                                )
                            )}

                        </div>

                    )}

                </div>

            </main>

            <MobileNav
                navigate={navigate}
            />

        </div>
    );
};

export default Shorts;