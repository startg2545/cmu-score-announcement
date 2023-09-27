const jwt = require("jsonwebtoken");

const verifyAndValidateToken = (token, res) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).send({ ok: false, message: "Invalid token" });
      } else {
        resolve(user);
      }
    });
  });
};

module.exports = {
  verifyAndValidateToken,
};
