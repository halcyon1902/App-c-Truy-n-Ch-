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
//#endregion
//#region view engine
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//#endregion
//#region nodemailer
app.get("/index", function (req, res) {
  res.render("index.ejs");
});
app.post("/send-mail", function (req, res) {
  //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
  var transporter = nodemailer.createTransport({
    // config mail server
    host: "smtp.gmail.com",
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASS,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  const content = `
  <div style="max-width: 600px; margin: auto">
    <div style="background-color: #003375; padding: 20px; text-align: center">
      <img src="/assets/img/icon.ico" alt="Logo" style="width: 200px">
    </div>
    <div style="padding: 20px">
      <h3>Xin chào,</h3>
      <p>Bạn đã gửi yêu cầu khôi phục mật khẩu. Đây là đường link để cập nhật mật khẩu mới:</p>
      <p><a href="" style="color: #0085ff">https://example.com/reset-password/</a></p>
      <p>Nếu bạn không yêu cầu thay đổi mật khẩu, thì hãy bỏ qua email này.</p>
      <p style="font-style: italic">Email này được tự động tạo ra, vui lòng không trả lời lại.</p>
    </div>
  </div>
`;

  var mainOptions = {
    from: "ReadingApp",
    to: req.body.mail,
    subject: "Recovery Password",
    html: content,
  };
  transporter.sendMail(mainOptions, function (err, info) {
    if (err) {
      console.log(err);
      res.redirect("/index");
    } else {
      res.redirect("/index");
    }
  });
});
//#endregion
