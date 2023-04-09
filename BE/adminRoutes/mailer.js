const express = require("express").Router();
const controller = require("../adminController/mailerController");
const nodemailer = require("nodemailer");
express.get("/", controller.GetMailer);
express.post("/", controller.PostMailer);
module.exports = express;
