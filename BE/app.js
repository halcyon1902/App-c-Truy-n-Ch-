const express = require("express");
const cors = require("cors");
const app = express();
const sessions = require("express-session");
const mongoose = require("mongoose");
var bodyParser = require("body-parser"); //bodyParser trả về một function hoạt động như một middleware. Chức năng lắng nghe trên req.on (\'data\') và xây dựng req.body từ các đoạn dữ liệu mà nó nhận được.
const morgan = require("morgan");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

const tacgiaRoute = require("./routes/TacGia");
const truyenRoute = require("./routes/Truyen");
const taikhoanRoute = require("./routes/TaiKhoan");
const chapterRoute = require("./routes/Chapter");
const binhluanRoute = require("./routes/BinhLuan");
const theloaiRoute = require("./routes/TheLoai");
//model
const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("./model/model");
//giao diện
const http = require("http");
const css = require("css");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors()); //CORS là một cơ chế cho phép nhiều tài nguyên khác nhau (fonts, Javascript, v.v…) của một trang web có thể được truy vấn từ domain khác với domain của trang
app.use(morgan("common")); // khi send request sẽ thông báo dưới terminal
//sử dụng session để kiểm tra login
app.use(
  sessions({
    secret: process.env.SERCRET_KEY,
    saveUninitialized: false,
    cookie: { maxAge: 900000 },
    resave: true,
  })
);
//kết nối database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, function (err) {
  if (err) {
    console.log("Connected to MongoDB fail:" + err);
  } else {
    console.log("Connected to MongoDB successful");
  }
});

//Routes
app.use("/TacGia", tacgiaRoute);
app.use("/TheLoai", theloaiRoute);
app.use("/Truyen", truyenRoute);
app.use("/TaiKhoan", taikhoanRoute);
app.use("/Chapter", chapterRoute);
app.use("/BinhLuan", binhluanRoute);

// sử dụng thư mục public
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//kiểm tra port hoạt động ở 8000
const server = http.Server(app);
server.listen(8000, () => {
  console.log(`Server is running → PORT ${server.address().port}`);
});
//routes admin
app.get("/", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      res.render("HomePage", { item });
    });
  } else {
    res.redirect("/login");
  }
});
//author
// show danh sách author
app.get("/author", (req, res) => {
  session = req.session;
  if (session.userid) {
    TacGia.find(function (err, items) {
      if (err) {
        console.log(err);
        res.render("../views/author/author", { listauthor: [] });
      } else {
        res.render("../views/author/author", { listauthor: items });
      }
    });
  } else {
    console.log("Chưa đăng nhập");
    res.redirect("/login");
  }
});
// show page tạo author
app.get("/author/create", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.render("../views/author/addAuthor", { message: 2 });
  } else {
    console.log("Chưa đăng nhập");
    res.redirect("/login");
  }
});
app.post("/author/create", (req, res) => {
  var author = new TacGia({
    TenTacGia: req.body.TenTacGia,
  });
  author.save(function (err) {
    if (err) {
      console.log("save author error:" + err);
      return res.render("../views/author/addAuthor", { message: 0 });
    } else {
      console.log("save author successfully with id author :" + author._id);
      return res.render("../views/author/addAuthor", { message: 1 });
    }
  });
});
//category
// show danh sách category
app.get("/category", (req, res) => {
  session = req.session;
  if (session.userid) {
    TheLoai.find(function (err, items) {
      if (err) {
        console.log(err);
        res.render("../views/category/category", { listcate: [] });
      } else {
        res.render("../views/category/category", { listcate: items });
      }
    });
  } else {
    console.log("Chưa đăng nhập");
    res.redirect("/login");
  }
});
// show page tạo category
app.get("/category/create", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.render("../views/category/addCategory", { message: 2 });
  } else {
    console.log("Chưa đăng nhập");
    res.redirect("/login");
  }
});
app.post("/category/create", (req, res) => {
  var cate = new TheLoai({
    TenTheLoai: req.body.TenTheLoai,
  });
  cate.save(function (err) {
    if (err) {
      console.log("save category error:" + err);
      res.render("../views/category/addCategory", { message: 0 });
    } else {
      console.log("save category successfully with id category :" + cate._id);
      res.render("../views/category/addCategory", { message: 1 });
    }
  });
});
//login
//show page login
const myusername = "admin";
const mypassword = "admin";
app.get("/login", (req, res) => {
  //2 là bình thường
  res.render("Login", { message: 2 });
});
//api đăng nhập
app.post("/login", (req, res) => {
  TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan }, async function (err, item) {
    if (!err && item != null) {
      const valid = await bcrypt.compare(req.body.MatKhau, item.MatKhau);
      if (valid) {
        // đúng mật khẩu
        session = req.session;
        session.userid = req.body.TaiKhoan;
        res.redirect("/");
      } else {
        //sai mật khẩu là 0
        res.render("Login", { message: 0 });
      }
    } else {
      //sai tài khoản là 1
      res.render("Login", { message: 1 });
    }
  });
});
