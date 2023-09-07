const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const studentModel = require("../db/studentSchema");
const router = express.Router();

// add student grade
router.post("/add", async (req, res) => {
  try {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });
    const decoded = jwt.decode(token);
    
    // find duplicated student
    const student = await studentModel.findOne({
      studentId: req.body.studentId
    })
    
    if (!student) {
      let courseNo = req.body.courseNo
      let semester = req.body.semester
      let year = req.body.year
      let score = req.body.score

      for (let i in score.results) {
        const newStudent = await studentModel.create({
          studentId: score.results[i].studentId,
          firstName: score.results[i].firstName,
          lastName: score.results[i].lastName,
          courseGrades: [
            {
              courseNo: courseNo,
              year: year,
              semester: semester,
              scores: [
                {
                  scoreName: score.scoreName,
                  point: score.results[i].point
                }
              ]
            }
          ]
        })
        newStudent.save();
      }
      return res.send('succeeded');
    }

    return res.send({
      message: "You Cannot Add This Course..",
    });
  } catch (err) {
    return err;
  }
});

router.get("/", async (req, res) => {
  try {
    const scores = await studentModel.findOne({
      studentId: req.query.studentId,
    });
    if (!scores)
      return res.send({ ok: true, message: "You don't have any score" });
    return res.send(scores);
  } catch (err) {
    return err;
  }
});

module.exports = router;
