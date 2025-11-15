import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import noteRoutes from "./routes/noteRoutes.js";
dotenv.config();
import "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// 1. CORS Configuration
// Allows requests from your React frontend (e.g., running on port 5173 for Vite)
const corsOptions = {
  origin: "*", // Adjust this to your frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// 2. Body Parser Middleware
app.use(express.json()); // To parse JSON bodies

// --- Routes ---
app.use("/api/notes", noteRoutes);

// Simple root route
app.get("/", (req, res) => {
  res.send("Note App Backend Running");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
