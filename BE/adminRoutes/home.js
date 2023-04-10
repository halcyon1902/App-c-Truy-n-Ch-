const express = require("express").Router();
const controller = require("../adminController/homeController");
const middlewarecontroller = require("../adminController/middlewareController");
express.get("/", middlewarecontroller.verifyTokenAndAdmin, controller.home);
module.exports = express;
