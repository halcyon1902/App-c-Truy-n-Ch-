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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
//CORS là một cơ chế cho phép nhiều tài nguyên khác nhau (fonts, Javascript, v.v…) của một trang web có thể được truy vấn từ domain khác với domain của trang
app.use(cors());
// khi send request sẽ thông báo dưới terminal
app.use(morgan("common"));
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
    console.log("CONNECTED TO MONGODB FAIL:" + err);
  } else {
    console.log("CONNECTED TO MONGODB SUCCESSFUL");
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
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//kiểm tra port hoạt động ở 8000
const server = app.listen(8000, function () {
  console.log("SERVER IS RUNNING ON http://localhost:" + server.address().port);
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
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      TacGia.find(function (err, items) {
        if (err) {
          console.log(err);
          res.render("../views/author/author", { listauthor: [], item });
        } else {
          res.render("../views/author/author", { listauthor: items, item });
        }
      });
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
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      res.render("../views/author/addAuthor", { message: 2, item });
    });
  } else {
    console.log("Chưa đăng nhập");
    res.redirect("/login");
  }
});
app.post("/author/create", (req, res) => {
  var author = new TacGia({
    TenTacGia: req.body.TenTacGia,
  });
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      author.save(function (err) {
        if (err) {
          console.log("save author error:" + err);
          return res.render("../views/author/addAuthor", { message: 0, item });
        } else {
          console.log("save author successfully with id author :" + author._id);
          return res.render("../views/author/addAuthor", { message: 1, item });
        }
      });
    });
  }
});
//show page update author with id
app.get("/author/update/:id", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      TacGia.findById(req.params.id, function (error, author) {
        if (error) {
        } else {
          res.render("../views/author/updateAuthor", { message: 2, item, author });
        }
      });
    });
  } else {
    console.log("Chưa đăng nhập");
    res.redirect("/login");
  }
});
//update author
app.post("/author/update/:id", (req, res) => {
  var update = { TenTacGia: req.body.TenTacGia };
  TacGia.findByIdAndUpdate(req.params.id, update, function (err, item) {
    if (err) {
      res.render("../views/author/updateAuthor", { message: 0, item, author });
    } else {
      res.redirect("/author");
    }
  });
});
//category
// show danh sách category
app.get("/category", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      TheLoai.find(function (err, items) {
        if (err) {
          console.log(err);
          res.render("../views/category/category", { listcate: [], item });
        } else {
          res.render("../views/category/category", { listcate: items, item });
        }
      });
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
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      res.render("../views/category/addCategory", { message: 2, item });
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/category/create", (req, res) => {
  var cate = new TheLoai({
    TenTheLoai: req.body.TenTheLoai,
  });
  TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
    cate.save(function (err) {
      if (err) {
        console.log("save category error:" + err);
        res.render("../views/category/addCategory", { message: 0, item });
      } else {
        console.log("save category successfully with id category :" + cate._id);
        res.render("../views/category/addCategory", { message: 1, item });
      }
    });
  });
});
//show page update category
app.get("/category/update/(:id)", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      res.render("../views/category/updateCategory", { message: 2, item });
    });
  } else {
    res.redirect("/login");
  }
});
//login
//show page login
app.get("/login", (req, res) => {
  session = req.session;
  if (session.userid) {
    res.redirect("/");
  } else {
    //2 là bình thường
    res.render("Login", { message: 2 });
  }
});
//api đăng nhập
app.post("/login", (req, res) => {
  TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan }, async function (err, item) {
    if (!err && item != null) {
      const valid = await bcrypt.compare(req.body.MatKhau, item.MatKhau);
      const role = item.PhanQuyen;
      const status = item.TrangThai;
      if (valid) {
        // đúng mật khẩu
        if (role && status) {
          session = req.session;
          session.userid = req.body.TaiKhoan;
          res.redirect("/");
        } else {
          //không có quyền truy cập
          res.render("Login", { message: 3 });
        }
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
