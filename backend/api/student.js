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

    const courseNo = req.body.courseNo;
    const semester = parseInt(req.body.semester);
    const year = parseInt(req.body.year);

    if (req.body.type == "publish_one") {
      const section = parseInt(req.body.section);
      const scoreName = req.body.scoreName;
      const results = req.body.results;
      
      await scoreModel.findOneAndUpdate(
        {
          courseNo,
          year,
          semester,
          "sections.section": section,
          "sections.scores.scoreName": scoreName,
        },
        {
          $set: {
            "sections.$[section].scores.$[score].isPublish": true,
          },
        },
        {
          new: true,
          arrayFilters: [
            { "section.section": section },
            { "score.scoreName": scoreName },
          ],
        }
      );

      results.map(async (result) => {
        const student = await studentModel.findOne({
          studentId: result.studentId,
        });

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
      });

      return res.send(`${scoreName} published`);
    } else if (req.body.type == "publish_many") {
      const sections = req.body.sections;
      const courseUpdates = [];
      const studentUpdates = [];
      for (const section of sections) {
        const req_section = section.section;
        for (const score of section.scores) {
          const {scoreName, results} = score;
          for (const result of results) {
            const { studentId, firstName, lastName, point } = result;
            let student = await studentModel.findOne({ studentId });
            if (!student) {
              const studentGrade = {
                studentId,
                firstName,
                lastName,
                courseGrades: [],
              };
              student = await studentModel.create(studentGrade);
            }
            // Find or create the course grade
            const courseGrade = {
              courseNo,
              section: req_section,
              year,
              semester,
              scores: [{ scoreName, point }],
            };
      
            const existingCourseIndex = student.courseGrades.findIndex(
              (grade) =>
                grade.courseNo === courseNo &&
                grade.section === req_section &&
                grade.year === year &&
                grade.semester === semester
            );
      
            if (existingCourseIndex !== -1) {
              // Update existing course grade
              const existingGrade = student.courseGrades[existingCourseIndex];
              const existingScoreIndex = existingGrade.scores.findIndex(
                (s) => s.scoreName === scoreName
              );
      
              if (existingScoreIndex !== -1) {
                // Update existing score
                existingGrade.scores[existingScoreIndex].point = point;
              } else {
                // Add new score
                existingGrade.scores.push({ scoreName, point });
              }
            } else {
              // Add new course grade
              student.courseGrades.push(courseGrade);
            }
      
            studentUpdates.push(student.save());
          }
        }
        courseUpdates.push({
          updateMany: {
            filter: {
              courseNo,
              year,
              semester,
              "sections.section": req_section,
            },
            update: {
              $set: {
                "sections.$[section].scores.$[].isPublish": true,
              },
            },
            arrayFilters: [{ "section.section": req_section }],
          },
        });
      }
      await Promise.all(studentUpdates);
      await scoreModel.bulkWrite(courseUpdates);
      return res.send("Completed");
    }
  } catch (err) {
    console.log(err);
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
