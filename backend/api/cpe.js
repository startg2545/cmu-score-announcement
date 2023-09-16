const express = require("express");
const axios = require("axios");
const { verifyAndValidateToken } = require("../jwtUtils");
const router = express.Router();

//get course detail from api cpe
router.get("/course", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);

    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const response = await axios.get(
      `${process.env.URL_PATH_CPE}/course/detail`,
      {
        headers: { Authorization: "Bearer " + process.env.TOKEN_API_CPE },
      }
    );

    const course = response.data.courseDetails.filter(
      (e) =>
        e.courseNo.substring(0, 3) === "261" ||
        e.courseNo.substring(0, 3) === "269"
    );

    res.send({ ok: true, courseDetails: course });
  } catch (err) {
    if (err.response.data) return res.send(err.response.data);
    return res.send({
      ok: false,
      message: "Cannot connect to CPE API Server. Please try again later.",
    });
  }
});

//get sections of course from api cpe
router.get("/sections", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token);

    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    const response = await axios.get(
      `${process.env.URL_PATH_CPE}/course/sections`,
      {
        params: {
          courseNo: req.query.courseNo,
          year: req.query.year,
          semester: req.query.semester,
        },
        headers: { Authorization: "Bearer " + process.env.TOKEN_API_CPE },
      }
    );

    res.send(response.data);
  } catch (err) {
    if (err.response.data) return res.send(err.response.data);
    return res.send({
      ok: false,
      message: "Cannot connect to CPE API Server. Please try again later.",
    });
  }
});

module.exports = router;
