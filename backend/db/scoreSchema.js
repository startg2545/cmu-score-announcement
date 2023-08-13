const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    courseOwner: [{ type: String }],
    courseNo: String,
    section: Number,
    year: Number,
    semaster: Number,
    details: [
      {
        scoreName: String,
        studentNumber: Number,
        fullScore: Number,
        isDisplayMean: Boolean,
        mean: Number,
        note: String,
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

module.exports = mongoose.model("scores", scoreSchema);
