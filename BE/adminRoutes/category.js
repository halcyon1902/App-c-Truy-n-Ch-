const express = require("express").Router();
const catecontroller = require("../admincontroller/cateController");
express.get("/", catecontroller.GetCate);
express.get("/create", catecontroller.GetCreateCate);
express.post("/create", catecontroller.PostCreateCate);
express.get("/update/:id", catecontroller.GetUpdateCate);
express.post("/update/:id", catecontroller.PostUpdateCate);
module.exports = express;
