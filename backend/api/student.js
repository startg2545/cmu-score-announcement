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
    
    let courseNo = req.body.courseNo
    let semester = req.body.semester
    let section = req.body.section
    let year = req.body.year
    let results = req.body.results
    let scoreName = req.body.scoreName

    const test_arr = []
    for (let i in results) {
      let student_obj = {
        studentId: results[i].studentId,
        firstName: results[i].firstName,
        lastName: results[i].lastName,
        point: results[i].point
      }

      const student = await studentModel.findOne({
        studentId: student_obj.studentId
      })

      if (student) {
        // this student has been graded
        const req_courseNo = await studentModel.findOne({
          studentId: student_obj.studentId,
          'courseGrades.courseNo': courseNo
        })

        if (req_courseNo) {
          // this student has this course

        } else {
          // this student doesn't have this course
          let courseGrade = {
            courseNo: courseNo,
            section: section,
            year: year,
            semester: semester, 
            scores: [
              {
                scoreName: scoreName,
                point: student_obj.point
              }
            ]
          }
          student.courseGrades.push(courseGrade)
          await student.save()
        }
        
      } else {
        // this student hasn't been graded yet
        const new_student = await studentModel.create(student_obj)
        new_student.save();
      }
    }
    return res.send('succeeded');
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
