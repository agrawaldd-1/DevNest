import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoutes from "./router/authRoutes.js";

dotenv.config({
  path: ".env",
});

await connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server Running...");
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`🚀 Server Running On Port ${port}`);
});