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
    const socket = req.app.get("socket");

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

    socket.emit("courseUpdate", "update student score");
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
    const socket = req.app.get("socket");

    const courseNo = req.body.courseNo;
    const courseName = req.body.courseName;
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
            { "score.scoreName": section },
          ],
        }
      );

      results.map(async (result) => {
        const student = await studentModel.findOne({
          studentId: result.studentId,
        });

        const courseGrade = {
          courseNo,
          courseName,
          section,
          year,
          semester,
          scores: [{ scoreName, point: result.point }],
        };
        if (student) {
          const reqCourse = student.courseGrades.find(
            (course) =>
              course.courseNo === courseNo &&
              course.courseName === courseName &&
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

      await scoreModel.findOneAndUpdate(
        {
          courseNo,
          courseName,
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

      socket.emit("courseUpdate", "published one");
      return res.send(`${scoreName} published`);
    } else if (req.body.type == "publish_many") {

      const sections = req.body.sections;

      for (const section of sections) {
        for (const score of section.scores) {
          const results = score.results;
          const promises = results.map(async (result) => {
            const student = await studentModel.findOne({
              studentId: result.studentId,
            });

            const courseGrade = {
              courseNo,
              courseName,
              section: section.section,
              year,
              semester,
              scores: [
                {
                  scoreName: score.scoreName,
                  point: result.point,
                }
              ],
            };

            if (student) {
              const reqCourse = student.courseGrades.find(
                (course) =>
                  course.courseNo === courseNo &&
                  course.courseName === courseName &&
                  course.section === section.section &&
                  course.year === year &&
                  course.semester === semester
              );
              if (reqCourse) {
                const scoreIndex = reqCourse.scores.findIndex(
                  (s) => s.scoreName === score.scoreName
                );
                
                if (scoreIndex !== -1) {
                  reqCourse.scores[scoreIndex].point = result.point;
                } else {
                  reqCourse.scores.push({
                    scoreName: score.scoreName,
                    point: result.point,
                  });
                }
              }

              await student.save();
            } else {
              const studentGrade = {
                studentId: result.studentId,
                firstName: result.firstName,
                lastName: result.lastName,
                courseGrades: [courseGrade],
              };

              const test = await studentModel.create(studentGrade);
            }
          });

          // Execute all promises concurrently and wait for them to complete
          await Promise.all(promises);



          await scoreModel.findOneAndUpdate(
            {
              courseNo,
              courseName,
              year,
              semester,
              "sections.section": section.section,
              "sections.scores.scoreName": score.scoreName
            },
            {
              $set: {
                "sections.$[section].scores.$[score].isPublish": true
              }
            },
            {
              new: true,
              arrayFilters: [
                { "section.section": section.section },
                { "score.scoreName": score.scoreName }
              ]
            }
          )
        }
      }

      socket.emit("courseUpdate", "published many");
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
    const user = await verifyAndValidateToken(token, res);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const year = parseInt(req.query.year);
    const semester = parseInt(req.query.semester);

    const scores = await studentModel.findOne({
      studentId: user.studentId,
    });
    if (!scores) {
      return res.send({ ok: false, message: "No Score" });
    }
    const courseGrades = scores.courseGrades.filter((e) => {
      return e.year === year && e.semester === semester;
    });

    if (!courseGrades.length) return res.send({ ok: false, message: "No Score" });
    return res.send({ ok: true, courseGrades });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
