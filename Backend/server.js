import app from "./src/app.js";
import connectDb from "./src/db/db.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL 

connectDb(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exitCode = 1;
  });
