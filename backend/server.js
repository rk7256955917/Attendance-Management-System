const attendanceRoutes = require("./routes/attendanceRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connect");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Student routes
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Attendance Management Backend is running");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});