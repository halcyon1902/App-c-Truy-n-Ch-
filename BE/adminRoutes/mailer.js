const express = require("express").Router();
const controller = require("../adminController/mailerController");
const middlewarecontroller = require("../adminController/middlewareController");
express.get("/", controller.GetMailer);
express.get("/reset", controller.GetUpdate);
express.post("/", controller.PostMailer);
express.post("/reset", middlewarecontroller.verifyToken, controller.PostUpdate);
module.exports = express;
