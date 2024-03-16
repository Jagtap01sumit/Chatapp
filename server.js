import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/authRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import connectDB from "./DB/connectDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRouter);

server.listen(PORT, () => {
  connectDB();
  console.log(`server listening on ${PORT}`);
});
