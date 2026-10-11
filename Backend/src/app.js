import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.js";
// import authRoutes from "./routes/authRoutes.js";
// import movieRoutes from "./routes/movieRoutes.js";
// import theatreRoutes from "./routes/theatreRoutes.js";
// import showRoutes from "./routes/showRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/movies", movieRoutes);
// app.use("/api/theatres", theatreRoutes);
// app.use("/api/shows", showRoutes);
// app.use("/api/bookings", bookingRoutes);

app.use(errorHandler); // keep last

export default app;