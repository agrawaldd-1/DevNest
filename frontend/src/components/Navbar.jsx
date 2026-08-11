import {
    Bell,
    LogOut,
    PenSquare,
} from "lucide-react";

const Navbar = ({ navigate, handleLogout }) => {
    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[#f5f7fb]/95 backdrop-blur-xl">

            <div className="mx-auto flex h-[72px] max-w-[1080px] items-center justify-between px-5 sm:px-7">

                <div>
                    <p className="text-xs font-medium text-slate-400">
                        Your workspace
                    </p>

                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                        Home
                    </h2>
                </div>

                <div className="flex items-center gap-2">

                    <button
                        onClick={() => navigate("/create-post")}
                        className="hidden h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30 sm:flex"
                    >
                        <PenSquare size={17} />
                        Create Post
                    </button>

                    <button
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                    >
                        <Bell size={19} />

                        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <LogOut size={17} />

                        <span className="hidden sm:block">
                            Logout
                        </span>
                    </button>

                </div>

            </div>

        </header>
    );
};

export default Navbar;