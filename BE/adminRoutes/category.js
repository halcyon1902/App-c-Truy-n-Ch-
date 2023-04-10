const express = require("express").Router();
const catecontroller = require("../adminController/cateController");
const middlewarecontroller = require("../adminController/middlewareController");
express.get("/", middlewarecontroller.verifyTokenAndAdmin, catecontroller.GetCate);
express.get("/create", middlewarecontroller.verifyTokenAndAdmin, catecontroller.GetCreateCate);
express.post("/create", middlewarecontroller.verifyTokenAndAdmin, catecontroller.PostCreateCate);
express.get("/update/:id", middlewarecontroller.verifyTokenAndAdmin, catecontroller.GetUpdateCate);
express.post("/update/:id", middlewarecontroller.verifyTokenAndAdmin, catecontroller.PostUpdateCate);
module.exports = express;
