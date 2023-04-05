const express = require("express").Router();
const controller = require("../adminController/homeController");
express.get("/", controller.home);
module.exports = express;
