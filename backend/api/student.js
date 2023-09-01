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

    console.log(req.body);

    // const newStudentGrade = await studentModel.create({
    //     studentID: req.body
    // })
    newStudentGrade.save();
    return res.send(newStudentGrade);
  } catch (err) {
    return err;
  }
});

router.get("/", async (req, res) => {
  try {
    const scores = await studentModel.findOne({
      studentId: req.query.studentId,
    });
    if (!scores)
      return res.send({ ok: true, message: "You don't have any score" });
    return res.send(scores);
  } catch (err) {
    return err;
  }
});

module.exports = router;
