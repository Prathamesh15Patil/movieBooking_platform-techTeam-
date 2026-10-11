import "dotenv/config";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (err) => console.error("Redis error:", err));

export const HOLD_SECONDS = 300;
export const seatLockKey = (showId, seatId) => `lock:${showId}:${seatId}`;

export default redis;