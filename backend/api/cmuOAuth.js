const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const adminUserModel = require("../db/adminUserSchema");
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
    if (typeof req.query.code !== "string") {
      return res
        .status(400)
        .send({ ok: false, message: "Invalid authorization code" });
    }
    //get access token
    const response = await axios.post(
      process.env.CMU_OAUTH_GET_TOKEN_URL,
      {},
      {
        params: {
          code: req.query.code,
          redirect_uri: process.env.CMU_OAUTH_REDIRECT_URL,
          client_id: process.env.CMU_OAUTH_CLIENT_ID,
          client_secret: process.env.CMU_OAUTH_CLIENT_SECRET,
          grant_type: "authorization_code",
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (!response) {
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get OAuth access token" });
    }
    //get basic info
    const response2 = await getCMUBasicInfoAsync(response.data.access_token);
    if (!response2) {
      return res
        .status(400)
        .send({ ok: false, message: "Cannot get cmu basic info" });
    }

    const itAccountType_id = (await adminUserModel.findOne({
      admin: response2.cmuitaccount,
    }))
      ? "Admin"
      : response2.itaccounttype_id;

    //create session
    const token = jwt.sign(
      response2.student_id
        ? {
            cmuAccount: response2.cmuitaccount,
            firstName: response2.firstname_EN,
            lastName: response2.lastname_EN,
            studentId: response2.student_id,
            itAccountType: itAccountType_id,
          }
        : {
            cmuAccount: response2.cmuitaccount,
            firstName: response2.firstname_EN,
            lastName: response2.lastname_EN,
            itAccountType: itAccountType_id,
          },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", // Token will last for 7 days only
      }
    );

    return res
      .cookie("token", token, {
        maxAge: 3600000 * 24 * 7, // Cookie will last for 7 days only
        //Set httpOnly to true so that client JavaScript cannot read or modify token
        //And the created token can be read by server side only
        httpOnly: true,
        sameSite: "lax",
        //force cookie to use HTTPS only in production code
        secure: process.env.NODE_ENV === "production",
      })
      .send(
        response2.student_id
          ? {
              cmuAccount: response2.cmuitaccount,
              firstName: response2.firstname_EN,
              lastName: response2.lastname_EN,
              studentId: response2.student_id,
              itAccountType: itAccountType_id,
            }
          : {
              cmuAccount: response2.cmuitaccount,
              firstName: response2.firstname_EN,
              lastName: response2.lastname_EN,
              itAccountType: itAccountType_id,
            }
      );
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
