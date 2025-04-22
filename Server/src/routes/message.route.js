import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessages, getAllUsers, sendMessage, getRecentUsers, setRecentUsers } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/getUsers", protectedRoute, getAllUsers);
router.get("/getRecentUsers", protectedRoute, getRecentUsers);
router.post("/setRecentUsers", protectedRoute, setRecentUsers);
router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage)

export default router;