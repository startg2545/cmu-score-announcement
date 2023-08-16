const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const courseModel = require("../db/scoreSchema");
const router = express.Router();

//add course & score
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

    const section = await courseModel.findOne({
      courseNo: req.body.courseNo,
      year: req.body.year,
      semester: req.body.semester,
      "sections.section": req.body.sections[0].section,
    });

    // if(req.body.courseNo.substring(0, 3) === "261" && decoded.cmuAccount === "dome.potikanond@cmu.ac.th")

    // add new course
    if (!section) {
      // add new score
      // course.sections.push(req.body.sections[0]);
      // await course.save();
      // return res.send(course);

      // add new section
      course.sections.push(req.body.sections[0]);
      await course.save();
      return res.send(course);
    } else if (!course) {
      const newCourse = await courseModel.create({
        courseNo: req.body.courseNo,
        year: req.body.year,
        semester: req.body.semester,
      });
      newCourse.save();
      return res.send(newCourse);
    }

    return res.send({
      message: "You Cannot Add This Course..",
    });
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

    const section = await courseModel.findOneAndUpdate(
      {
        courseNo: req.query.courseNo,
        year: req.query.year,
        semester: req.query.semester,
        "sections.section": req.query.section,
      },
      {
        $push: {"sections.$.coInstructors": req.query.coInstructors},
      },
      { new: true }
    );
    await section.save();
    return res.send(section);
  } catch (err) {
    return err;
  }
});

module.exports = router;
