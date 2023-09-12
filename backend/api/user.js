const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.cookies.token;

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(401).send({ ok: false, message: "Invalid token" });
      else if (!user.cmuAccount)
        return res.status(403).send({ ok: false, message: "Invalid token" });
    });

    const decoded = jwt.decode(token);

    return decoded.studentId
      ? res.send({
          cmuAccount: decoded.cmuAccount,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          studentId: decoded.studentId,
          itAccountType: decoded.itAccountType,
        })
      : res.send({
          cmuAccount: decoded.cmuAccount,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          itAccountType: decoded.itAccountType,
        });
  } catch (err) {
    return err;
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
