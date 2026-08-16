const express = require("express");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

const router = express.Router();


// ===============================
// POST - Add Student
// ===============================
router.post("/", async (req, res) => {
  try {

    const student = new Student(req.body);

    const savedStudent = await student.save();

    res.status(201).json(savedStudent);

  } catch (error) {

    // Duplicate roll number
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ye Roll Number already exist karta hai",
      });
    }

    res.status(500).json({
      message: "Student add nahi ho paya",
      error: error.message,
    });
  }
});


// ===============================
// GET - Get All Students
// ===============================
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


// ===============================
// PUT - Update Student
// ===============================
router.put("/:id", async (req, res) => {
  try {

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


    // Student nahi mila
    if (!updatedStudent) {
      return res.status(404).json({
        message: "Student nahi mila",
      });
    }


    res.status(200).json(updatedStudent);

  } catch (error) {

    // Duplicate roll number
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Ye Roll Number already exist karta hai",
      });
    }

    res.status(500).json({
      message: "Student update nahi ho paya",
      error: error.message,
    });
  }
});


// ===============================
// DELETE - Delete Student
// ===============================
router.delete("/:id", async (req, res) => {
  try {

    // 1. Student delete karo
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );


    // Student nahi mila
    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student nahi mila",
      });
    }


    // 2. Student ki saari attendance delete karo
    await Attendance.deleteMany({
      student: req.params.id,
    });


    // 3. Response
    res.status(200).json({
      message: "Student aur uski attendance successfully delete ho gayi",
      student: deletedStudent,
    });

  } catch (error) {

    res.status(500).json({
      message: "Student delete nahi ho paya",
      error: error.message,
    });
  }
});


module.exports = router;