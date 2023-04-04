const express = require("express").Router();
const controller = require("../admincontroller/homeController");
express.get("/", controller.home);
module.exports = express;
