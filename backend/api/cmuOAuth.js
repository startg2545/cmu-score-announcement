const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const router = express.Router();

const getCMUBasicInfoAsync = async (accessToken) => {
  try {
    const response = await axios.get(process.env.CMU_OAUTH_GET_BASIC_INFO, {
      headers: { Authorization: "Bearer " + accessToken },
    });
    return response.data;
  } catch (err) {
    return err;
  }
};

router.post("/", async (req, res) => {
  try {
    //validate code
    if (typeof req.query.code !== "string")
      return res
        .status(400)
        .send({ ok: false, message: "Invalid authorization code" });

    //get access token
    const response = await axios.post(
      process.env.CMU_OAUTH_GET_TOKEN_URL,
      {},
      {
        params: {
          code: req.query.code,
          redirect_uri: req.query.redirect_uri,
          client_id: req.query.client_id,
          client_secret: req.query.client_secret,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (!response)
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get OAuth access token" });

    //get basic info
    const response2 = await getCMUBasicInfoAsync(response.data.access_token);
    if (!response2)
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get cmu basic info" });

    const itAccountType_id = response2.cmuitaccount === "newin_yamaguchi@cmu.ac.th" ? "MISEmpAcc" : response2.itaccounttype_id;

    //create session
    const token = jwt.sign(
      {
        cmuAccount: response2.cmuitaccount,
        firstName: response2.firstname_EN,
        lastName: response2.lastname_EN,
        studentId: response2.student_id ? response2.student_id : null, //Note that not everyone has this. Teachers and CMU Staffs don't have student id!
        itAccountType: itAccountType_id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // Token will last for one day only
      }
    );

    res
      .cookie("token", token, {
        maxAge: 3600000 * 24, // Cookie will last for one day only
        //Set httpOnly to true so that client JavaScript cannot read or modify token
        //And the created token can be read by server side only
        httpOnly: true,
        sameSite: "lax",
        //force cookie to use HTTPS only in production code
        secure: process.env.NODE_ENV === "production",
        path: "/",
        //change to your hostname in production
        domain: process.env.DOMAIN,
      })
      .send({
        cmuAccount: response2.cmuitaccount,
        firstName: response2.firstname_EN,
        lastName: response2.lastname_EN,
        studentId: response2.student_id ? response2.student_id : null,
        itAccountType: itAccountType_id,
      });
  } catch (err) {
    return err;
  }
});

module.exports = router;
