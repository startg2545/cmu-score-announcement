const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: Number,
    firstName: String,
    lastName: String,
    courseGrades: [
      {
        courseNo: String,
        section: Number,
        year: Number,
        semester: Number,
        scores: [
          {
            scoreName: String,
            point: Number,
          },
        ]
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("students", studentSchema);
