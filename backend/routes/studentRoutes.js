const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// POST - Add Student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);

  } catch (error) {
    res.status(500).json({
      message: "Student add nhi ho paya",
      error: error.message,
    });
  }
});

// GET - Get All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json(students);

  } catch (error) {
    res.status(500).json({
      message: "Students fetch nahi ho paye",
      error: error.message,
    });
  }
});

module.exports = router;