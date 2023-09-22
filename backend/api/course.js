const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const courseModel = require("../db/scoreSchema");
const studentModel = require("../db/studentSchema");
const router = express.Router();

// add course & score
router.post("/add", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }
    const socket = req.app.get("socket");

    const { courseNo, year, semester, sections } = req.body;
    // Find the course
    let course = await courseModel.findOne({ courseNo, year, semester });
    // Create the course
    if (!course) {
      course = await courseModel.create({
        courseNo,
        courseName: req.body.courseName,
        year,
        semester,
        sections: [
          {
            section: null,
            instructor: user.cmuAccount,
          },
        ],
      });
      socket.emit("courseUpdate", "update");
      return res.send({ ok: true, message: "The course have been added." });
    }

    // Update sections
    let canAdd = [];
    let cannotAdd = [];
    if (sections) {
      for (const reqSection of sections) {
        const section = course.sections.find(
          (s) =>
            s.section === reqSection.section &&
            (s.instructor === user.cmuAccount ||
              s.coInstructors?.includes(user.cmuAccount))
        );

        if (section) {
          for (const newScore of reqSection.scores) {
            const existingScore = section.scores.find(
              (score) => score.scoreName === newScore.scoreName
            );

            if (existingScore) {
              // Update existing score
              Object.assign(existingScore, newScore);
            } else {
              // Add new score
              section.scores.push(newScore);
            }
          }
          canAdd.push(reqSection.section);
        } else {
          //have section but user not instructor / co-instructor
          const alreadySection = course.sections.find(
            (s) => s.section === reqSection.section
          );
          if (alreadySection) cannotAdd.push(reqSection.section);
          else {
            const coIns = course.sections.find(
              (s) =>
                s.instructor === user.cmuAccount ||
                s.coInstructors.includes(user.cmuAccount)
            ).coInstructors;
            reqSection["coInstructors"] = coIns;
            course.sections.push(reqSection);
            canAdd.push(reqSection.section);
          }
        }
      }
      await course.save();
    }
    const section = course.sections.find(
      (s) =>
        s.instructor === user.cmuAccount ||
        s.coInstructors.includes(user.cmuAccount)
    );
    if (!section) {
      course.sections.push({
        section: null,
        instructor: user.cmuAccount,
      });
    } else {
      course.sections = course.sections.filter(
        (section) => section.section !== null
      );
    }
    await course.save();
    socket.emit("courseUpdate", "update");
    if (cannotAdd.length === 0)
      return res.send({ ok: true, message: "The score have been added/edit." });
    else
      return res.send({
        ok: false,
        sectionAddEdit: canAdd,
        sectionCannotAddEdit: cannotAdd,
      });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

//add coInstructors of section
router.put("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }
    const socket = req.app.get("socket");

    await courseModel.findOneAndUpdate(
      {
        courseNo: req.body.courseNo,
        year: req.body.year,
        semester: req.body.semester,
        "sections.instructor": user.cmuAccount,
      },
      { $addToSet: { "sections.$[].coInstructors": req.body.coInstructors } },
      { new: true }
    );
    socket.emit("courseUpdate", "update");
    return res.send("Co-Instructor have been added.");
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

//delete course
router.delete("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);
    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }
    const socket = req.app.get("socket");

    const { courseNo, year, semester } = req.query;

    let course = await courseModel.findOne({ courseNo, year, semester });
    const sectionsToRemove = course.sections.filter(
      (e) =>
        e.instructor === user.cmuAccount ||
        e.coInstructors.includes(user.cmuAccount)
    );
    const uniqueStudentIds = new Set();
    for (const section of sectionsToRemove) {
      if (section.scores.length) {
        const studentIds = section.scores[0].results.map(
          (score) => score.studentId
        );
        studentIds.forEach((studentId) => {
          uniqueStudentIds.add(studentId);
        });
      }
    }
    const updateStudent = [...uniqueStudentIds].map(async (studentId) => {
      await studentModel.findOneAndUpdate(
        {
          studentId,
        },
        {
          $pull: {
            courseGrades: {
              courseNo,
              year,
              semester,
            },
          },
        },
        { new: true }
      );
    });
    await Promise.all(updateStudent);
    const coures = await courseModel.findOneAndUpdate(
      {
        courseNo,
        year,
        semester,
        $or: [
          { "sections.instructor": user.cmuAccount },
          { "sections.coInstructors": user.cmuAccount },
        ],
      },
      {
        $pull: {
          sections: {
            $or: [
              { instructor: user.cmuAccount },
              { coInstructors: { $in: user.cmuAccount } },
            ],
          },
        },
      },
      {
        new: true,
      }
    );
    if (!coures.sections.length) {
      await courseModel.findOneAndDelete({ courseNo, year, semester });
    }
    socket.emit("courseUpdate", "update");
    return res.send({ ok: true, message: "The course have been deleted." });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;
