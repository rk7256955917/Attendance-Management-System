const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();

// Mark Attendance
router.post("/", async (req, res) => {
  try {
    const { date, student, status } = req.body;

    const attendance = new Attendance({
      date,
      student,
      status,
    });

    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);

  } catch (error) {
    res.status(500).json({
      message: "Attendance save nahi ho payi",
      error: error.message,
    });
  }
});


// Get all attendance
router.get("/", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("student");

    res.status(200).json(attendance);

  } catch (error) {
    res.status(500).json({
      message: "Attendance fetch nahi ho payi",
      error: error.message,
    });
  }
});


module.exports = router;