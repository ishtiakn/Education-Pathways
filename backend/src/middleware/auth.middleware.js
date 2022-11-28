/*
 * Middleware function used to authenticate incoming protected requests
 */

const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET_KEY
    );
    next();
  } catch (err) {
    res.status(401).send("Bad auth");
  }
};

module.exports = auth;
