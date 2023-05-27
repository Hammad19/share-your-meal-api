import express from "express";
import { getNotifications } from "../controllers/NotificationController";

const router = express.Router();

router.route("/:user_email").get(getNotifications);

export default router;
