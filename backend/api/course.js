const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const courseModel = require("../db/scoreSchema");
const router = express.Router();

// add course & score
router.post("/add", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);

    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const { courseNo, year, semester, sections } = req.body;

    // Find the course
    let course = await courseModel.findOne({ courseNo, year, semester });
    // Create the course
    if (!course) {
      course = await courseModel.create({
        courseNo,
        year,
        semester,
        sections: [
          {
            instructor: user.cmuAccount,
          },
        ],
      });
      return res.send({ ok: true, message: "The course have been added." });
    } else {
      course.sections = course.sections.filter(
        (section) => section.section !== null
      );
      await course.save();
    }
    // Update sections
    let canAdd = [];
    let cannotAdd = [];
    for (const reqSection of sections) {
      const section = course.sections.find(
        (s) =>
          s.section === reqSection.section &&
          (s.instructor === user.cmuAccount ||
            s.coInstructors.includes(user.cmuAccount))
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
          course.sections.push(reqSection);
          canAdd.push(reqSection.section);
        }
      }
    }
    await course.save();
    if (cannotAdd.length === 0)
      return res.send({ ok: true, message: "The sections have been added." });
    else
      return res.send({
        ok: false,
        sectionAddEdit: canAdd,
        sectionCannotAddEdit: cannotAdd,
      });
  } catch (err) {
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

    const result = await courseModel.findOneAndUpdate(
      {
        courseNo: req.query.courseNo,
        year: req.query.year,
        semester: req.query.semester,
        "sections.instructor": user.cmuAccount,
      },
      { $addToSet: { "sections.$[].coInstructors": req.query.coInstructors } },
      { new: true }
    );

    await result.save();
    return res.send("Co-Instructor have been added.");
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

module.exports = router;