import {
    Home,
    Search,
    FolderKanban,
    Clapperboard,
    MessageSquare,
    UserRound,
    PenLine,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const MobileNav = () => {
    const navigate = useNavigate();

    const navItems = [
        {
            path: "/dashboard",
            icon: Home,
        },
        {
            path: "/search",
            icon: Search,
        },
        {
            path: "/projects",
            icon: FolderKanban,
        },
        {
            path: "/shorts",
            icon: Clapperboard,
        },
        {
            path: "/chat",
            icon: MessageSquare,
        },
        {
            path: "/profile",
            icon: UserRound,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:hidden">
            <div className="relative mx-auto flex h-[64px] max-w-xl items-center justify-between px-3">

                {navItems.slice(0, 3).map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                                    isActive
                                        ? "text-blue-600"
                                        : "text-slate-500 hover:text-slate-800"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <Icon
                                    size={23}
                                    strokeWidth={isActive ? 2.6 : 2}
                                />
                            )}
                        </NavLink>
                    );
                })}

                <button
                    onClick={() => navigate("/create-post")}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/30 transition-all active:scale-90"
                    aria-label="Create Post"
                >
                    <PenLine size={23} strokeWidth={2.3} />
                </button>

                {navItems.slice(3).map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                                    isActive
                                        ? "text-blue-600"
                                        : "text-slate-500 hover:text-slate-800"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <Icon
                                    size={23}
                                    strokeWidth={isActive ? 2.6 : 2}
                                />
                            )}
                        </NavLink>
                    );
                })}

            </div>
        </div>
    );
};

export default MobileNav;