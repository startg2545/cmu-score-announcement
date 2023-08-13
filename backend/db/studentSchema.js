const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentID: Number,
    courseScores: [
      {
        courseNo: String,
        section: String,
        year: Number,
        semaster: Number,
        details: [
          {
            scoreName: String,
            point: Number,
          }
        ]
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("students", studentSchema);
