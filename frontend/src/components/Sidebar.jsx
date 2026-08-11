import {
    Home,
    User,
    FolderKanban,
    Clapperboard,
    MessageSquare,
    Search,
    LogOut,
    Code2,
} from "lucide-react";

const Sidebar = ({ user, navigate, handleLogout }) => {
    return (
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-[245px] flex-col border-r border-slate-800/80 bg-[#0b1220] lg:flex">

            <div className="border-b border-white/5 px-5 py-5">
                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-600/20">
                        <Code2 size={21} className="text-white" />
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

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
                        {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>

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

export default Sidebar;