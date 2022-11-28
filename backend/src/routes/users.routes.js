/*
 * Define routes on user endpoint
 */

const express = require("express");
const userController = require("../controllers/users.controller.js");

const router = new express.Router();

router.post("/users/login", userController.login);

module.exports = router;
