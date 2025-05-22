import express from "express";
import {
  createShortUrl,
  redirectFromShortUrl,
  getAllUserUrls,
} from "../controllers/url.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // assuming you have this

const router = express.Router();

// @route   POST /api/url
router.post("/", authMiddleware, createShortUrl);

// @route   GET /api/url/user
router.get("/user", authMiddleware, getAllUserUrls);

router.get("/:shortCode", redirectFromShortUrl);

export default router;
