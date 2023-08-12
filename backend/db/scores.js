const mongoose = require("mongoose");

const scoresSchema = new mongoose.Schema({
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
          student_code: String,
          point: Number,
          comment: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Tests", scoresSchema);
