/*
 * Setup express application
 */

const express = require("express");
require("./models");
const courseRouter = require("./routes/courses.routes");
const userRouter = require("./routes/users.routes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(courseRouter);
app.use(userRouter);

module.exports = app;
