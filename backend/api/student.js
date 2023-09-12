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
    
    const courseNo = req.body.courseNo
    const semester = req.body.semester
    const year = req.body.year

    if (req.body.type == 'publish_many') {
      const test_arr = []
      const sections = req.body.sections
      for (let section in sections) {
        const scores = sections[section].scores
        for (let score in scores) {
          const results = scores[score].results
          const scoreName = scores[score].scoreName
          for (let result in results) {
            const student_obj = {
              studentId: results[result].studentId,
              firstName: results[result].firstName,
              lastName: results[result].lastName,
              point: results[result].point
            }
            const student = await studentModel.findOne({
              studentId: student_obj.studentId
            })

            const req_section = sections[section].section
            const courseGrade = {
              courseNo: courseNo,
              section: req_section,
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
              const course_model = await studentModel.findOne({
                studentId: student_obj.studentId,
                'courseGrades.courseNo': courseNo,
                'courseGrades.year': year,
                'courseGrades.semester': semester,
                'courseGrades.section': req_section,
              })
              if (course_model) {
                // this student has this course
                const score_model = await studentModel.findOne({
                  studentId: student_obj.studentId,
                  'courseGrades.courseNo': courseNo,
                  'courseGrades.scores.scoreName': scoreName
                })
                
                if (score_model) {
                  for (let grade in student.courseGrades) {
                    for (let score in student.courseGrades[grade].scores) {
                      if (
                        student.courseGrades[grade].courseNo == courseNo &&
                        student.courseGrades[grade].scores[score].scoreName == scoreName
                        ) {
                        // this student has existing score in this course
                        student.courseGrades[grade].scores[score].point = student_obj.point
                        await student.save()
                      } 
                    }
                  }
                } else {
                  for (let grade in student.courseGrades) {
                    if ( student.courseGrades[grade].courseNo == courseNo ) {
                      let send_obj = {
                        scoreName: scoreName,
                        point: student_obj.point
                      }
                      // this student doesn't have existing score in this course
                      student.courseGrades[grade].scores.push(send_obj)
                      await student.save()
                    }
                  }
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
        }
      }
      return res.send('publish all succeeded')
    } else if (req.body.type == 'publish_one') {
      const test_arr = []
      let section = req.body.section
      let results = req.body.results
      let scoreName = req.body.scoreName
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
              for (let x in student.courseGrades) {
                for (let y in student.courseGrades[x].scores) {
                  if (
                    student.courseGrades[x].courseNo == courseNo &&
                    student.courseGrades[x].scores[y].scoreName == scoreName
                  )
                  student.courseGrades[x].scores[y].point = student_obj.point
                  await student.save()
                }
              }
            } else {
              let req_score = {
                scoreName: scoreName,
                point: student_obj.point
              }
              for (let x in student.courseGrades) {
                if ( student.courseGrades[x].courseNo == courseNo ) {
                  student.courseGrades[x].scores.push(req_score)
                  await student.save()
                }
              }
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
      return res.send(test_arr)
      return res.send('publish_one succeeded')
    }

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