const express = require("express");
const cors = require("cors");
const app = express();
const sessions = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const nodemailer = require("nodemailer");
const flash = require("express-flash");
dotenv.config();
//model
const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("./model/model");
//giao diện
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(flash());
app.use(cors());
app.use(morgan("common"));
//sử dụng session để kiểm tra login
app.use(
  sessions({
    secret: process.env.SERCRET_KEY,
    saveUninitialized: false,
    cookie: { maxAge: 90000000 },
    resave: true,
  })
);
//#region database và port
//kết nối database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, function (err) {
  if (err) {
    console.log("CONNECTED TO MONGODB FAIL:" + err);
  } else {
    console.log("CONNECTED TO MONGODB SUCCESSFUL");
  }
});
//kiểm tra port hoạt động ở 8000
const server = app.listen(8000, function () {
  console.log("SERVER IS RUNNING ON http://localhost:" + server.address().port);
});
//#endregion
//#region routes
//routes user
app.use("/TacGia", require("./routes/TacGia"));
app.use("/TheLoai", require("./routes/TheLoai"));
app.use("/Truyen", require("./routes/Truyen"));
app.use("/TaiKhoan", require("./routes/TaiKhoan"));
app.use("/Chapter", require("./routes/Chapter"));
//routes admin
app.use("/author", require("./adminRoutes/author"));
app.use("/story", require("./adminRoutes/story"));
app.use("/category", require("./adminRoutes/category"));
app.use("/user", require("./adminRoutes/user"));
app.use("/", require("./adminRoutes/home"));
app.use("/", require("./adminRoutes/auth"));
app.use("/resetPass", require("./adminRoutes/mailer"));
//#endregion
//#region view engine
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//#endregion
