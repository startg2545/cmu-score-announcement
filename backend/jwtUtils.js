const jwt = require("jsonwebtoken");

const verifyAndValidateToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
};

module.exports = {
  verifyAndValidateToken,
};
