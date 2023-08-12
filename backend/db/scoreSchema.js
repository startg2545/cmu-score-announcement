const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    courseOwner: [{ type: String }],
    courseNo: String,
    section: String,
    year: Number,
    semaster: Number,
    details: [
      {
        scoreName: String,
        studentNumber: Number,
        fullScore: Number,
        isDisplayMean: Boolean,
        mean: Number,
        results: [
          {
            student_code: Number,
            point: Number,
            comment: String,
          },
        ],
      },
    ],
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("scoreTest", scoreSchema);
