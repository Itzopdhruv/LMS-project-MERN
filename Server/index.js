import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import userroute from "./Routes/user.route.js";
import cors from "cors";

// 1️⃣ Load environment variables FIRST
dotenv.config({});

// 2️⃣ Connect to MongoDB
connectDB();
console.log("Mongo connect or not")
const app = express();

// 3️⃣ Middleware setup

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // ✅ Allow both
  credentials: true,
}));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// 4️⃣ Routes
app.use("/api/v1/user", userroute);

// 5️⃣ Start the server
const PORT = process.env.PORT || 8080; // Fallback to 8080 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});