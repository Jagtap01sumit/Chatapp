import express from "express";
import { sendMessage, getMessages } from "../Controller/messageController.js";
import protectRoute from "../Middleware/ProtectRoute.js";

const router = express.Router();
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages);
export default router;
