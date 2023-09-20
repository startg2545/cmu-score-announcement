const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const scoreModel = require("../db/scoreSchema");
const studentModel = require("../db/studentSchema");
const router = express.Router();

// update student grade
router.put("/update", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const { courseNo, section, year, semester, studentId, scoreName, point } =
      req.body;

    const student = await studentModel.findOneAndUpdate(
      {
        studentId: studentId,
        "courseGrades.courseNo": courseNo,
        "courseGrades.year": year,
        "courseGrades.semester": semester,
        "courseGrades.scores.scoreName": scoreName,
      },
      {
        $set: {
          "courseGrades.$.scores.$[scoreElem].point": point,
        },
      },
      {
        new: true,
        arrayFilters: [{ "scoreElem.scoreName": scoreName }],
      }
    );

    const course = await scoreModel.findOneAndUpdate(
      {
        courseNo,
        year,
        semester,
        "sections.section": section,
        "sections.scores.scoreName": scoreName,
      },
      {
        $set: {
          "sections.$[section].scores.$[score].results.$[student].point": point,
        },
      },
      {
        new: true,
        arrayFilters: [
          { "section.section": section },
          { "score.scoreName": scoreName },
          { "student.studentId": studentId },
        ],
      }
    );

    return res.send("success");
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

// add student grade
router.post("/add", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    if (req.body.type == "publish_one") {
      

      // await scoreModel.findOneAndUpdate(
      //   {
      //     courseNo,
      //     year,
      //     semester,
      //     "sections.section": section,
      //     "sections.scores.scoreName": scoreName,
      //   },
      //   {
      //     $set: {
      //       "sections.$[section].scores.$[score].isPublish": true,
      //     },
      //   },
      //   {
      //     new: true,
      //     arrayFilters: [
      //       { "section.section": section },
      //       { "score.scoreName": section },
      //     ],
      //   }
      // );
      
      const courseNo = req.body.courseNo;
      const semester = parseInt(req.body.semester);
      const year = parseInt(req.body.year);
      const section = parseInt(req.body.section);
      const scoreName = req.body.scoreName;
      const results = req.body.results;

      results.map(async result=>{
        const student = await studentModel.findOne({ studentId: result.studentId });
        
        const courseGrade = {
          courseNo,
          section,
          year,
          semester,
          scores: [{ scoreName, point: result.point }],
        };
        if (student) {
          const reqCourse = student.courseGrades.find(
            (course) =>
              course.courseNo === courseNo &&
              course.section === section &&
              course.year === year &&
              course.semester === semester
          );
      
          if (reqCourse) {
            const scoreIndex = reqCourse.scores.findIndex(
              (score) => score.scoreName === scoreName
            );
      
            if (scoreIndex !== -1) {
              reqCourse.scores[scoreIndex].point = result.point;
            } else {
              reqCourse.scores.push({ scoreName, point: result.point });
            }
          } else {
            student.courseGrades.push(courseGrade);
          }
      
          await student.save();
        } else {
          const studentGrade = {
            studentId: result.studentId,
            firstName: result.firstName,
            lastName: result.lastName,
            courseGrades: [courseGrade],
          };
      
          await studentModel.create(studentGrade);
        }
      })
      
      
      return res.send(`${scoreName} published`);

    } else if (req.body.type == "publish_many") {
      const courseNo = req.body.courseNo;
      const semester = req.body.semester;
      const year = req.body.year;
      const sections = req.body.sections;
      for (let section in sections) {
        await scoreModel.findOneAndUpdate(
          {
            courseNo,
            year,
            semester,
            "sections.section": sections[section].section,
          },
          {
            $set: {
              "sections.$[section].scores.$[].isPublish": true,
            },
          },
          {
            new: true,
            arrayFilters: [{ "section.section": sections[section].section }],
          }
        );
        const scores = sections[section].scores;
        for (let score in scores) {
          const results = scores[score].results;
          const scoreName = scores[score].scoreName;
          for (let result in results) {
            const student_obj = {
              studentId: results[result].studentId,
              firstName: results[result].firstName,
              lastName: results[result].lastName,
              point: results[result].point,
            };
            const student = await studentModel.findOne({
              studentId: student_obj.studentId,
            });

            const req_section = sections[section].section;
            const courseGrade = {
              courseNo: courseNo,
              section: req_section,
              year: year,
              semester: semester,
              scores: [
                {
                  scoreName: scoreName,
                  point: student_obj.point,
                },
              ],
            };

            if (student) {
              // this student has been graded
              const course_model = await studentModel.findOne({
                studentId: student_obj.studentId,
                "courseGrades.courseNo": courseNo,
                "courseGrades.year": year,
                "courseGrades.semester": semester,
                "courseGrades.section": req_section,
              });
              if (course_model) {
                // this student has this course
                const score_model = await studentModel.findOne({
                  studentId: student_obj.studentId,
                  "courseGrades.courseNo": courseNo,
                  "courseGrades.scores.scoreName": scoreName,
                });

                if (score_model) {
                  for (let grade in student.courseGrades) {
                    for (let score in student.courseGrades[grade].scores) {
                      if (
                        student.courseGrades[grade].courseNo == courseNo &&
                        student.courseGrades[grade].scores[score].scoreName ==
                          scoreName
                      ) {
                        // this student has existing score in this course
                        student.courseGrades[grade].scores[score].point =
                          student_obj.point;
                        // await student.save();
                      }
                    }
                  }
                } else {
                  for (let grade in student.courseGrades) {
                    if (student.courseGrades[grade].courseNo == courseNo) {
                      let send_obj = {
                        scoreName: scoreName,
                        point: student_obj.point,
                      };
                      // this student doesn't have existing score in this course
                      student.courseGrades[grade].scores.push(send_obj);
                      // await student.save();
                    }
                  }
                }
              } else {
                // this student doesn't have this course
                student.courseGrades.push(courseGrade);
                // await student.save();
              }

              await student.save();

            } else {
              // this student hasn't been graded yet
              let studentGrade = {
                studentId: student_obj.studentId,
                firstName: student_obj.firstName,
                lastName: student_obj.lastName,
                courseGrades: [courseGrade],
              };
              const new_student = await studentModel.create(studentGrade);
              new_student.save();
            }
          }
        }
      }
      return res.send("Completed");
    }
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

// get scores of each student
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const scores = await studentModel.findOne({
      studentId: user.studentId,
    });
    if (!scores) return res.send({ ok: false, message: "No Course" });
    return res.send({ ok: true, scores });
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
