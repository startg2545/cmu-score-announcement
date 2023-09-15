const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyAndValidateToken } = require("../jwtUtils");
const scoreModel = require("../db/scoreSchema");
const router = express.Router();

//get scores
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);

    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    //get one score for cal stat in student dashboard
    if (req.query.scoreName) {
      const section = await scoreModel.findOne({
        courseNo: req.query.courseNo,
        "sections.section": req.query.section,
      });
      const score = section.sections[0].scores.filter(
        (e) => e.scoreName === req.query.scoreName
      );
      return res.send(score[0]);
    } else {
      //get all score of each instructor/co-instructor
      const course = await scoreModel.find({
        year: req.query.year,
        semester: req.query.semester,
        $or: [
          { "sections.instructor": user.cmuAccount },
          { "sections.coInstructors": user.cmuAccount },
        ],
      });
      if (course.length) return res.send({ok: true, course});
      else return res.send({ok: false, message: "You don't have any course."})
    }
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
