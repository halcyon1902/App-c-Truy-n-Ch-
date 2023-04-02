const express = require("express").Router();
const controller = require("../admincontroller/homeController");
const middlewarecontroller = require("../admincontroller/middlewareController");
express.get("/", controller.home);
module.exports = express;
