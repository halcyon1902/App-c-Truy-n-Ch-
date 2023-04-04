const express = require("express").Router();
const controller = require("../admincontroller/storyController");
express.get("/", controller.GetStory);
express.get("/create", controller.GetCreateStory);
express.post("/create", controller.PostCreateStory);
express.get("/update/:id", controller.GetUpdateStory);
express.post("/update/:id", controller.PostUpdateStory);
module.exports = express;
