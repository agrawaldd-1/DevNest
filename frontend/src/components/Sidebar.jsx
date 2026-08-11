import {
    Home,
    Search,
    UserRound,
    FolderKanban,
    Clapperboard,
    MessageSquare,
    Bookmark,
    Settings,
    LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = ({ user, handleLogout }) => {
    const navItems = [
        {
            name: "Home",
            path: "/dashboard",
            icon: Home,
        },
        {
            name: "Search",
            path: "/search",
            icon: Search,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: UserRound,
        },
        {
            name: "Projects",
            path: "/projects",
            icon: FolderKanban,
        },
        {
            name: "Shorts",
            path: "/shorts",
            icon: Clapperboard,
        },
        {
            name: "Chat",
            path: "/chat",
            icon: MessageSquare,
        },
    ];

    // const secondaryItems = [
    //     {
    //         name: "Bookmarks",
    //         path: "/bookmarks",
    //         icon: Bookmark,
    //     },
    //     {
    //         name: "Settings",
    //         path: "/settings",
    //         icon: Settings,
    //     },
    // ];

    return (
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[245px] border-r border-slate-800 bg-[#08101f] lg:block">

            <div className="flex h-full flex-col">

                <div className="flex h-[92px] items-center border-b border-slate-800 px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-violet-500/20">
                            <span className="text-xl font-bold text-white">
                                &lt;/&gt;
                            </span>
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-white">
                                SkillSync
                            </h1>

                            <p className="text-[10px] font-semibold tracking-[0.18em] text-slate-500">
                                DEVELOPER NETWORK
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pt-8">

                    <p className="mb-4 px-4 text-[11px] font-semibold tracking-[0.2em] text-slate-600">
                        WORKSPACE
                    </p>

                    <nav className="space-y-2">

                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-500/10 text-blue-400"
                                                : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={21}
                                                strokeWidth={isActive ? 2.2 : 1.8}
                                                className={
                                                    isActive
                                                        ? "text-blue-400"
                                                        : "text-slate-500 group-hover:text-slate-300"
                                                }
                                            />

                                            <span>{item.name}</span>

                                            {isActive && item.name === "Home" && (
                                                <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}

                    </nav>
                </div>

                

                <div className="mt-auto border-t border-slate-800 p-4">

                    <div className="flex items-center gap-3 rounded-xl bg-slate-900/70 p-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 font-bold text-white">
                            {user?.username?.charAt(0)?.toUpperCase() || "D"}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-white">
                                {user?.username || "User"}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                                {user?.email || ""}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-slate-500 transition hover:text-white"
                            title="Logout"
                        >
                            <LogOut size={19} />
                        </button>

                    </div>

                </div>

            </div>
        </aside>
    );
};

export default Sidebar;