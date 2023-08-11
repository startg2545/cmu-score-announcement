const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/detail", async (req, res) => {
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

module.exports = router;
