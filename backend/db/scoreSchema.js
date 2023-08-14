const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    courseNo: String,
    year: Number,
    semester: Number,
    sections: [
      {
        section: String,
        instructor: String,
        coInstructors: [{ type: String }],
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
                comment: String
              }
            ]
          }
        ]
      }
    ]
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("scores", scoreSchema);
