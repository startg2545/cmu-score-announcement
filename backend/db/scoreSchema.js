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
            note: String,
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
