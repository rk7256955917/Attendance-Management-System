const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["P", "L", "A"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


// Same student + same date = only one attendance
attendanceSchema.index(
  { student: 1, date: 1 },
  { unique: true }
);


const Attendance = mongoose.model(
  "Attendance",
  attendanceSchema
);

module.exports = Attendance;