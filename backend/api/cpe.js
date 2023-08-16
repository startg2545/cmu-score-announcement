const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

//get course detail from api cpe
router.get("/course", async (req, res) => {
  try {
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

//get sections of course from api cpe
router.get("/sections", async (req, res) => {
  try {
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
    return err;
  }
});

//get teacher from api cpe
router.get("/teacher", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.URL_PATH_CPE}/teacher`, {
      headers: { Authorization: "Bearer " + process.env.TOKEN_API_CPE },
    });

    res.send(response.data);
  } catch (err) {
    return err;
  }
});

module.exports = router;
