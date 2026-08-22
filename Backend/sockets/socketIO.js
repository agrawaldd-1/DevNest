import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import { Message } from "../models/message.js";
import { getRoomId } from "../utils/roomId.js";

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Access Denied. No Token Provided.")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;

            next();
        } catch (error) {
            console.error(
                "Socket Authentication Error:",
                error.message
            );

            next(new Error("Invalid or Expired Token"));
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.user.id.toString();

        console.log("Socket Connected:",socket.id,"User:",userId);

        socket.on("joinChat", ({ otherUserId }) => {
            try {
                if (!otherUserId) {
                    return;
                }

                const roomId = getRoomId(
                    userId,
                    otherUserId
                );

                socket.join(roomId);

                console.log(
                    `User ${userId} joined room ${roomId}`
                );

                socket.emit("joinedChat", {roomId,});}
                catch (error) {
                console.error(
                    "Join Chat Error:",
                    error.message
                );
            }
        });

        socket.on("sendMessage", async ({ to, text }) => {
            try {
                if (!to || !text?.trim()) {
                    return;
                }

                const senderId = userId;
                const receiverId = to.toString();

                const roomId = getRoomId(
                    senderId,
                    receiverId
                );

                const message = await Message.create({
                    roomId,
                    sender: senderId,
                    message: text.trim(),
                });

                io.to(roomId).emit(
                    "messageReceived",
                    message
                );
            } catch (error) {
                console.error(
                    "Send Message Error:",
                    error.message
                );

                socket.emit("messageError", {
                    message: "Failed to send message",
                });
            }
        });

        socket.on("disconnect", () => {
            console.log(
                "Socket Disconnected:",
                socket.id,
                "User:",
                userId
            );
        });
    });

    return io;
};