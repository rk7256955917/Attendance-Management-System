const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();


// ===============================
// POST - Mark / Update Attendance
// ===============================
router.post("/", async (req, res) => {
  try {

    const { date, student, status } = req.body;

    // Basic validation
    if (!date || !student || !status) {
      return res.status(400).json({
        message: "Date, student aur status required hain",
      });
    }

    // Same student + same date ka attendance check
    const selectedDate = new Date(date);

    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);


    const existingAttendance = await Attendance.findOne({
      student,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });


    // Agar attendance already hai
    if (existingAttendance) {

      existingAttendance.status = status;

      const updatedAttendance =
        await existingAttendance.save();

      return res.status(200).json({
        message: "Attendance update ho gayi",
        attendance: updatedAttendance,
      });
    }


    // Agar attendance nahi hai to new record
    const attendance = new Attendance({
      date: selectedDate,
      student,
      status,
    });

    const savedAttendance =
      await attendance.save();


    res.status(201).json({
      message: "Attendance save ho gayi",
      attendance: savedAttendance,
    });


  } catch (error) {

    res.status(500).json({
      message: "Attendance save nahi ho payi",
      error: error.message,
    });

  }
});


// ===============================
// GET - All Attendance
// ===============================
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


// ===============================
// GET - Attendance By Date
// ===============================
router.get("/date/:date", async (req, res) => {
  try {

    const selectedDate = req.params.date;

    const startDate = new Date(selectedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(23, 59, 59, 999);


    const attendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("student");


    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: "Date-wise attendance fetch nahi ho payi",
      error: error.message,
    });

  }
});


// ===============================
// GET - Single Student Attendance
// ===============================
router.get("/student/:studentId", async (req, res) => {
  try {

    const attendance = await Attendance.find({
      student: req.params.studentId,
    }).sort({ date: -1 });


    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: "Student attendance fetch nahi ho payi",
      error: error.message,
    });

  }
});


module.exports = router;