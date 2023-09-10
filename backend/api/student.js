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

      const courseGrade = {
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

      if (student) {
        // this student has been graded
        const req_course = await studentModel.findOne({
          studentId: student_obj.studentId,
          'courseGrades.courseNo': courseNo,
          'courseGrades.section': section,
          'courseGrades.year': year,
          'courseGrades.semester': semester
        })

        if (req_course) {
          // this student has this course

          const score = await studentModel.findOne({
            studentId: student_obj.studentId,
            'courseGrades.courseNo': courseNo,
            'courseGrades.scores.scoreName': scoreName
          })

          if (score) {
            for (let x in score.courseGrades) {
              for (let y in score.courseGrades[x].scores) {
                const req_score = {
                  scoreName: scoreName,
                  point: student_obj.point
                }
                if (
                  score.courseGrades[x].courseNo == courseNo,
                  score.courseGrades[x].scores[y].scoreName == scoreName
                  ) {
                  // this student has existing score in this course
                  score.courseGrades[x].scores[y].point = req_score.point
                  await score.save()
                } else if (
                  score.courseGrades[x].courseNo == courseNo,
                  score.courseGrades[x].scores[y].scoreName != scoreName
                ) {
                  // this student doesn't have existing score in this course
                  score.courseGrades[x].scores.push(req_score)
                  await score.save()
                }
              }
            }
          } else {
          }
        } else {
          // this student doesn't have this course
          student.courseGrades.push(courseGrade)
          await student.save()
        }
        
      } else {
        // this student hasn't been graded yet
        let studentGrade = {
          studentId: student_obj.studentId,
          firstName: student_obj.firstName,
          lastName: student_obj.lastName,
          courseGrades: [courseGrade]
        }
        const new_student = await studentModel.create(studentGrade)
        new_student.save();
      }
    }
    return res.send(test_arr);
  } catch (err) {
    return err;
  }
});

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });
    const decoded = jwt.decode(token);

    const scores = await studentModel.findOne({
      studentId: decoded.studentId,
    });
    if (!scores)
      return res.send({ ok: false, message: "You don't have any score" });
    return res.send({ ok: true, scores});
  } catch (err) {
    return err;
  }
});

module.exports = router;
