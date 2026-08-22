import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "node:http";


import { connectDB } from "./config/db.js";
import authRoutes from "./router/authRoutes.js";
import profileRoutes from "./router/profileRoutes.js";
import authPosts from "./router/postRoutes.js";
import projectRoutes from "./router/projectRoutes.js";
import likeRoutes from "./router/likeRoutes.js";
import commentRoutes from "./router/commentRoutes.js";
import shortRoutes from "./router/shortRoutes.js";
import connectionRoutes from "./router/connectionRoutes.js";
import notificationRoutes from "./router/notificationRoutes.js";
import searchRoutes from "./router/searchRoutes.js";
import { initializeSocket } from "./sockets/socketIO.js";
import messageRoutes from "./router/messageRoutes.js";

dotenv.config({
    path: ".env",
});

await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/posts", authPosts);
app.use("/api/projects", projectRoutes);
app.use("/api/shorts", shortRoutes);
app.use("/api/engagement", likeRoutes);
app.use("/api/engagement", commentRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
    res.send("Server Running...");
});

const port = process.env.PORT || 5000;

const server = createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`🚀 Server Running On Port ${port}`);
});