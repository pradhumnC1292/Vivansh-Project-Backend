import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middleware/errorHandler.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(
  cors({
    origin: "https://vivansh-project-001.netlify.app/",
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(errorHandler);
app.use("/api", userRoutes);

// console.log("mongodb --> ", process.env.MONGO_URI);
// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
