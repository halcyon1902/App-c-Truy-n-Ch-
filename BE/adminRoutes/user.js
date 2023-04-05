const express = require("express").Router();
const usercontroller = require("../adminController/userController");
express.get("/", usercontroller.GetUser);
express.get("/create", usercontroller.GetCreateUser);
express.post("/create", usercontroller.PostCreateUser);
express.get("/update/:id", usercontroller.GetUpdateUser);
express.post("/update/:id", usercontroller.PostUpdateUser);
module.exports = express;
