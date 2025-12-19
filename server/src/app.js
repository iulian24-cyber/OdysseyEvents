import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";

const app = express();

/* ===============================
   CORS CONFIG FOR LOCAL + RENDER
=============================== */
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CORS_ORIGIN,   // Your Render frontend URL
].filter(Boolean); // remove undefined

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("🚫 BLOCKED BY CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

export default app;
