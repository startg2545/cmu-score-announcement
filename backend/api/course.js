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
        // sections: req.body.sections
      });
      newCourse.save();
      return res.send(newCourse);
    } else {      
      var req_sections = req.body.sections

      for (let key in req_sections) {
        const section = await courseModel.findOne({
          courseNo: req.body.courseNo.toString(),
          year: req.body.year,
          semester: req.body.semester,
          'sections.section': req_sections[key].section.toString()
        })
        if (section !== null) {
          // update scores on this existing section here
          
        } else {
          // new section is added here
          req.body.sections.forEach((e) => {
            course.sections.push(e);
          });
          await course.save();
        }
      }

      return res.send('The sections have been added.')
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
        $push: { "sections.$.coInstructors": req.query.coInstructors },
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
