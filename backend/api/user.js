const express = require("express");
const { verifyAndValidateToken } = require("../jwtUtils");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const user = await verifyAndValidateToken(token, res);

    if (!user.cmuAccount) {
      return res.status(403).send({ ok: false, message: "Invalid token" });
    }

    return res.send({ok: true, user});
  } catch (err) {
    return res
      .status(500)
      .send({ ok: false, message: "Internal Server Error" });
  }
});

router.post("/signOut", async (req, res) => {
  res
    .clearCookie("token", {
      path: "/",
      //change to your hostname in production
      domain: process.env.DOMAIN,
    })
    .send({ ok: true });
});

module.exports = router;
