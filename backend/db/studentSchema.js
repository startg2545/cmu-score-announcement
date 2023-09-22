const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: Number, unique: true },
    firstName: String,
    lastName: String,
    courseGrades: [
      {
        courseNo: String,
        courseName: String,
        section: Number,
        year: Number,
        semester: Number,
        scores: [
          {
            scoreName: String,
            point: Number,
          },
        ],
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("students", studentSchema);
