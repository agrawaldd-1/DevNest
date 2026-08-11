import {
    Heart,
    MessageCircle,
    Share2,
    MoreHorizontal,
} from "lucide-react";

import PostAction from "./PostAction.jsx";

const PostCard = ({
    username,
    time,
    title,
    description,
    avatar,
    verified = false,
}) => {
    return (
        <article className="group mb-6 overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">

            <div className="p-5 sm:p-6">

                <div className="flex items-start justify-between">

                    <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 text-sm font-bold text-white">
                            {avatar}
                        </div>

                        <div className="min-w-0">

                            <div className="flex items-center gap-1.5">

                                <h3 className="truncate text-sm font-bold text-slate-900">
                                    {username}
                                </h3>

                                {verified && (
                                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                                        ✓
                                    </span>
                                )}

                            </div>

                            <p className="mt-0.5 text-xs text-slate-400">
                                {time}
                            </p>

                        </div>

                    </div>

                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                        <MoreHorizontal size={19} />
                    </button>

                </div>

                <div className="mt-5">

                    <h2 className="text-lg font-bold tracking-tight text-slate-900">
                        {title}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                        {description}
                    </p>

                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                    <div className="flex items-center gap-1">

                        <PostAction
                            icon={<Heart size={17} />}
                            label="Like"
                        />

                        <PostAction
                            icon={<MessageCircle size={17} />}
                            label="Comment"
                        />

                        <PostAction
                            icon={<Share2 size={17} />}
                            label="Share"
                        />

                    </div>

                    <button className="text-xs font-semibold text-slate-400 transition hover:text-blue-600">
                        View post
                    </button>

                </div>

            </div>

        </article>
    );
};

export default PostCard;