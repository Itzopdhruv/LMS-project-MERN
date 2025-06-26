import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import userroute from "./Routes/user.route.js";
import cors from "cors";
import courseroute from "./Routes/course.route.js";
import mediaroute from "./Routes/media.route.js";
import purchaseRoute from "./Routes/purchaseCourse.route.js";
import courseProgressRoute from "./Routes/Course.Progress.route.js";
// 1️⃣ Load environment variables FIRST
dotenv.config({});

// 2️⃣ Connect to MongoDB
connectDB();
console.log("Mongo connect or not")
const app = express();

// 3️⃣ Middleware setup

app.use(cors({
  origin: ["https://lms-project-mern-frontend.onrender.com"], // ✅ Allow both
  credentials: true,
}));

// app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf; // save raw body for HMAC check
    },
  })
);

// 4️⃣ Routes
app.use("/api/v1/user", userroute);
app.use("/api/v1/course",courseroute);
app.use("/api/v1/media",mediaroute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);
 
// 5️⃣ Start the server
const PORT = process.env.PORT || 8080; // Fallback to 8080 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
