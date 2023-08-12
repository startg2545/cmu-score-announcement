const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const scoreModel = require("../db/scoreSchema");
const router = express.Router();

//get scores
router.get("/", async (req, res) => {
    try {
      const token = req.cookies.token;
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err)
          return res.status(401).send({ ok: false, message: "Invalid token" });
        else if (!user.cmuAccount)
          return res.status(403).send({ ok: false, message: "Invalid token" });
      });
  
      const course = await scoreModel.find();
      return res.send(course);
    } catch (err) {
      return err;
    }
  });
  
  module.exports = router;