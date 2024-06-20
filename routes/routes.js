import express from "express";

import { healthCheck, sendMessage } from "../controllers/messageController.js";
import {
  auth,
  callback,
  getMe,
  getUserProfile,
} from "../controllers/authController.js";
import { createChat } from "../controllers/chatController.js";
import {
  createSubscription,
  webhook,
  lifecycle,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/", healthCheck);

router.get("/auth/login", auth);
router.get("/auth/callback", callback);
router.get("/teams/getuserid", getMe);

router.post("/teams/create", createChat);
router.post("/teams/sendmessage", sendMessage);

router.get("/getuserprofile", getUserProfile);

router.get("/createsubcrption", createSubscription);
router.post("/webhook", webhook);
router.post("/lifecycle", lifecycle);

export default router;
