const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
//giao diện
const http = require("http");
const css = require("css");
//
app.use(bodyParser.json({ limit: "50mb" }));
//CORS là một cơ chế cho phép nhiều tài nguyên khác nhau (fonts, Javascript, v.v…) của một trang web có thể được truy vấn từ domain khác với domain của trang
app.use(cors());
// khi send request sẽ thông báo dưới terminal
app.use(morgan("common"));
//kiểm tra port hoạt động ở 8000
const server = app.listen(8000, () => {
  console.log(`Server is running → PORT ${server.address().port}`);
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
