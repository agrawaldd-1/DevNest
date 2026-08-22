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
        "http://localhost:5000",
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