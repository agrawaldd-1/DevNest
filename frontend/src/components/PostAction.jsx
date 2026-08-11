const Avatar = ({
    username = "",
    image,
}) => {
    if (image) {
        return (
            <img
                src={image}
                alt={username}
                className="h-10 w-10 shrink-0 rounded-xl object-cover"
            />
        );
    }

    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white">
            {username?.charAt(0)?.toUpperCase() || "U"}
        </div>
    );
};

export default Avatar;