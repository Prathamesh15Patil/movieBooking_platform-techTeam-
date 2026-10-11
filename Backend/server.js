import app from "./src/app.js";
import connectDb from "./src/db/db.js";
import dotenv from "dotenv";
import redis from "./src/db/redis.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL 

connectDb(MONGO_URL)
  .then(async () => {
    try {
      await redis.connect();
      console.log("Redis connected");
    } catch (err) {
      console.error("Redis unavailable; starting without seat-locking support:", err.message);
    }
  })
  .then(() => {
    console.log("MongoDB connected");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Backend startup error:", err);
    process.exitCode = 1;
  });
