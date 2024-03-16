import express from "express";
import protectRoute from "../Middleware/ProtectRoute.js";
import { getUsersForSidebar } from "../Controller/userController.js";

const router = express.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;
