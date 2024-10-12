import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import vehicleRoutes from "./routes/vehicle.js";
import driverRoutes from "./routes/driver.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", vehicleRoutes);
app.use("/api", driverRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
