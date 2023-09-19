const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    courseNo: String,
    courseName: String,
    year: Number,
    semester: Number,
    sections: [
      {
        section: Number,
        instructor: String,
        coInstructors: [{ type: String }],
        scores: [
          {
            scoreName: String,
            studentNumber: Number,
            fullScore: Number,
            isPublish: Boolean,
            results: [
              {
                studentId: Number,
                firstName: String,
                lastName: String,
                point: Number,
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
