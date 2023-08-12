const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const testModel = require("../db/scores");
const router = express.Router();

//get course detail from api cpe
router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });

    const response = await axios.get(
      `${process.env.URL_PATH_CPE}/course/detail`,
      {
        headers: { Authorization: "Bearer " + process.env.TOKEN_API_CPE },
      }
    );
    res.send(response.data);
  } catch (err) {
    return err;
  }
});

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
    const course = await testModel.findOne({
      courseNo: req.query.courseNo,
      section: req.query.section,
      year: req.query.year,
      semaster: req.query.semaster,
    });

    console.log(course);

    // if(req.query.courseNo.substring(0, 3) === "261" && decoded.cmuAccount === "dome.potikanond@cmu.ac.th")

    if (!course) {
      const course = new testModel({
        courseOwner: [decoded.cmuAccount],
        courseNo: req.query.courseNo,
        section: req.query.section,
        year: req.query.year,
        semaster: req.query.semaster,
      });

      await course.save();
      return res.send(course);
    } else if (course.courseOwner.includes(decoded.cmuAccount)) {
      
    }

    return res.send({
      message: "You Cannot Add This Course",
    });
  } catch (err) {
    return err;
  }
});

//add owner of course
router.put("/owner", async (req, res) => {
  try {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });

    const course = await testModel.findOne({
      courseNo: req.query.courseNo,
      section: req.query.section,
      year: req.query.year,
      semaster: req.query.semaster,
    });

    course.courseOwner.push(req.query.owner);
    await course.save();
    return res.send(course);
  } catch (err) {
    return err;
  }
});

//get score
router.get("/score", async (req, res) => {
  try {
    const token = req.cookies.token;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });

    res.send(response.data);
  } catch (err) {
    return err;
  }
});

module.exports = router;
