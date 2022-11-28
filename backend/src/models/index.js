/*
 * Connect to database
 */

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_CONNECTION, {
  useNewUrlParser: true,
});
