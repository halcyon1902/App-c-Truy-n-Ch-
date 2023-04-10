const express = require("express").Router();
const authorcontroller = require("../adminController/authorController");
const middlewarecontroller = require("../adminController/middlewareController");
express.get("/", middlewarecontroller.verifyTokenAndAdmin, authorcontroller.GetAuthor);
express.get("/create", middlewarecontroller.verifyTokenAndAdmin, authorcontroller.GetCreateAuthor);
express.post("/create", middlewarecontroller.verifyTokenAndAdmin, authorcontroller.PostCreateAuthor);
express.get("/update/:id", middlewarecontroller.verifyTokenAndAdmin, authorcontroller.GetUpdateAuthor);
express.post("/update/:id", middlewarecontroller.verifyTokenAndAdmin, authorcontroller.PostUpdateAuthor);
module.exports = express;
