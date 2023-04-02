const express = require("express").Router();
const authorcontroller = require("../admincontroller/authorController");
const middlewarecontroller = require("../admincontroller/middlewareController");
express.get("/", authorcontroller.GetAuthor);
express.get("/create", authorcontroller.GetCreateAuthor);
express.post("/create", authorcontroller.PostCreateAuthor);
express.get("/update/:id", authorcontroller.GetUpdateAuthor);
express.post("/update/:id", authorcontroller.PostUpdateAuthor);
module.exports = express;
