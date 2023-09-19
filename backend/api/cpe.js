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
        params: {
          courseNo: req.query.courseNo,
        },
        headers: { Authorization: "Bearer " + process.env.TOKEN_API_CPE },
      }
    );

    return res.send(response.data);
  } catch (err) {
    if (!err.response) {
      return res.send({
        ok: false,
        message: "Cannot connect to API Server. Please try again later.",
      });
    } else if (!err.response.data.ok) return err.response.data;
    else return err;
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

    return res.send(response.data);
  } catch (err) {
    if (!err.response) {
      return res.send({
        ok: false,
        message: "Cannot connect to API Server. Please try again later.",
      });
    } else if (!err.response.data.ok) return err.response.data;
    else return err;
  }
});

module.exports = router;
