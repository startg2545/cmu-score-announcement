const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const courseModel = require("../db/scoreSchema");
const e = require("express");
const router = express.Router();

// add course & score
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

    // find duplicated course
    const course = await courseModel.findOne({
      courseNo: req.body.courseNo,
      year: req.body.year,
      semester: req.body.semester,
    });

    // add new course
    if (!course) {
      const newCourse = await courseModel.create({
        courseNo: req.body.courseNo,
        year: req.body.year,
        semester: req.body.semester,
      });
      newCourse.save();
      return res.send(newCourse);
    } else {
      var req_sections = req.body.sections;

      for (let i in req_sections) {
        const section = await courseModel.findOne({
          courseNo: req.body.courseNo.toString(),
          year: req.body.year,
          semester: req.body.semester,
          "sections.section": req_sections[i].section.toString(),
        });
        if (section) {
          // push or replace scores on this existing section here
          for (let j in req_sections[i].scores) {
            for (let x in section.sections) {
              if (
                section.sections[x].section ==
                  req_sections[i].section.toString() &&
                section.sections[x].scores.find(
                  (el) => el.scoreName == req_sections[i].scores[j].scoreName
                ) != null
              ) {
                section.sections[x].scores[j] = req_sections[i].scores[j];
                await section.save();
              } else if (
                section.sections[x].section ==
                  req_sections[i].section.toString() &&
                section.sections[x].scores.find(
                  (el) => el.scoreName == req_sections[i].scores[j].scoreName
                ) == null
              ) {
                section.sections[x].scores.push(req_sections[i].scores[j]);
                await section.save();
              }
            }
          }
        } else {
          // push new request section appends to course
          course.sections.push(req_sections[i]);
          await course.save();
        }
      }
      return res.send("The sections have been added.");
    }
  } catch (err) {
    return err;
  }
});

//add coInstructors of section
router.put("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });

    const decoded = jwt.decode(token);

    const result = await courseModel.findOneAndUpdate(
      {
        courseNo: req.query.courseNo,
        year: req.query.year,
        semester: req.query.semester,
        "sections.instructor": decoded.cmuAccount,
      },
      { $push: { "sections.$[].coInstructors": req.query.coInstructors } },
      { new: true }
    );

    console.log(result.sections);

    await result.save();
    return res.send("Co-Instructor have been added.");
  } catch (err) {
    return err;
  }
});

module.exports = router;
