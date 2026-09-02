import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return null;
    }

    if (socket?.connected) {
        return socket;
    }

    socket = io(
        import.meta.env.VITE_API_URL || "https://devnest-1-b73r.onrender.com",
        {
            auth: {
                token,
            },
            transports: ["websocket"],
        }
    );

    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};