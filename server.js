import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/authRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import userRouter from "./Routes/userRoutes.js";
import connectDB from "./DB/connectDB.js";
import { app, server } from "./socket/socket.js";
import path from "path";
import { allowedNodeEnvironmentFlags } from "process";
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// app.use("/public", express.static(path.join(__dirname, "/public")));
// app.use(express.static(path.join(__dirname, "/public")));
const PORT = process.env.PORT || 5000;

app.get("*", (req, res) => {
  let url = path.join(__dirname, "/public/", "index.html");
  res.sendFile(url);
});
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRouter);

server.listen(PORT, () => {
  connectDB();
  console.log(`server listening on ${PORT}`);
});
