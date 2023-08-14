const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentID: Number,
    courseGrades: [
      {
        courseNo: Number,
        grade: String,
        year: Number,
        semester: Number,
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("students", studentSchema);
