const express = require("express").Router();
const authcontroller = require("../adminController/authController");
const middlewarecontroller = require("../adminController/middlewareController");
express.get("/login", authcontroller.GetLogin);
express.post("/login", authcontroller.PostLogin);
express.get("/logout", authcontroller.GetLogout);
module.exports = express;
