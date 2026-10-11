import "dotenv/config";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: false,
  },
});
redis.on("error", (err) => console.error("Redis error:", err));

export const HOLD_SECONDS = 300;
export const seatLockKey = (showId, seatId) => `lock:${showId}:${seatId}`;

export const requireRedis = () => {
  if (!redis.isReady) {
    const error = new Error("Seat locking service is unavailable");
    error.status = 503;
    throw error;
  }
};

export default redis;