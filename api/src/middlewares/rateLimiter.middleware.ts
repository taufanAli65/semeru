import rateLimit from "express-rate-limit";
import { NODE_ENV } from "../config/index.config";

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000); // default 15 minutes
const maxRequests = Number(
  process.env.RATE_LIMIT_MAX ?? (NODE_ENV === "production" ? 100 : 300)
);

/**
 * Global rate limiter to protect the API from brute-force and abuse.
 * Uses standard headers (RateLimit-*) and disables deprecated X-RateLimit headers.
 */
export const rateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
  skip: (req) => req.method === "OPTIONS", // allow CORS preflight
});