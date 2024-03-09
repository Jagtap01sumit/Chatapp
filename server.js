import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./Routes/authRoutes.js";
import messageRoutes from "./Routes/messageRoutes.js";
import connectDB from "./DB/connectDB.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server listening on ${PORT}`);
});
