const express = require("express").Router();
const authcontroller = require("../admincontroller/authController");
const middlewarecontroller = require("../admincontroller/middlewareController");

// express.get("/login", authcontroller.getLogin);
// express.post("/login", authcontroller.login);
// express.post("/logout", middlewarecontroller.verifyToken, authcontroller.logout);

express.get("/login", authcontroller.GetLogin);
express.post("/login", authcontroller.PostLogin);
express.get("/logout", authcontroller.GetLogout);
module.exports = express;
