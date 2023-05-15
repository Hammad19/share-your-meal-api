import { createReview, getReviews } from "../controllers/ReviewController.js";
import express from "express";

const router = express.Router();

router.post("/", createReview);
router.get("/:user", getReviews);

export default router;
