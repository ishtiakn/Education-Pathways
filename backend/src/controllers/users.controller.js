/*
 * Define functions on user endpoint
 */

const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Authenticate admin user
// The provided jwt token will allow
// admins to access protected course routes

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!(await bcrypt.compare(req.body.password, user.password)))
      throw new Error("Bad auth");
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1 day",
    });
    res.send({ token });
  } catch (err) {
    res.status(401).send("Bad auth");
  }
};

module.exports = {
  login,
};
