const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser"); //bodyParser trả về một function hoạt động như một middleware. Chức năng lắng nghe trên req.on (\'data\') và xây dựng req.body từ các đoạn dữ liệu mà nó nhận được.
const morgan = require("morgan");
const dotenv = require("dotenv");
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
  res.render("HomePage");
});
//author
// show danh sách author
app.get("/author", (req, res) => {
  TacGia.find(function (err, items) {
    if (err) {
      console.log(err);
      res.render("../views/author/author", { listauthor: [] });
    } else {
      res.render("../views/author/author", { listauthor: items });
    }
  });
});
// show page tạo author
app.get("/author/create", (req, res) => {
  res.render("../views/author/addAuthor");
});
app.post("/author/create", (req, res) => {
  var author = new TacGia({
    TenTacGia: req.body.TenTacGia,
  });
  author.save(function (err) {
    if (err) {
      console.log("save author error:" + err);
      return res.render("../views/author/addAuthor", { message: "Thêm tác giả không thành công" });
    } else {
      console.log("save author successfully with id author :" + author._id);
      return res.render("../views/author/addAuthor", { message: "Thêm tác giả thành công" });
    }
  });
});
//category
// show danh sách category
app.get("/category", (req, res) => {
  TheLoai.find(function (err, items) {
    if (err) {
      console.log(err);
      res.render("../views/category/category", { listcate: [] });
    } else {
      res.render("../views/category/category", { listcate: items });
    }
  });
});
// show page tạo category
app.get("/category/create", (req, res) => {
  res.render("../views/category/addCategory");
});
app.post("/category/create", (req, res) => {
  var cate = new TheLoai({
    TenTheLoai: req.body.TenTheLoai,
  });
  cate.save(function (err) {
    if (err) {
      console.log("save category error:" + err);
      return res.render("../views/category/addCategory", { message: "Thêm thể loại không thành công" });
    } else {
      console.log("save category successfully with id category :" + cate._id);
      return res.render("../views/category/addCategory", { message: "Thêm thể loại thành công" });
    }
  });
});
