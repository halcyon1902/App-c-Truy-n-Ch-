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
app.use("/TacGia", tacgiaRoute);
app.use("/TheLoai", theloaiRoute);
app.use("/Truyen", truyenRoute);
app.use("/TaiKhoan", taikhoanRoute);
app.use("/Chapter", chapterRoute);
app.use("/BinhLuan", binhluanRoute);
//#endregion
//#region view engine
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", "./views");
//#endregion
//#region author
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
    res.redirect("/login");
  }
});
//update author
app.post("/author/update/:id", (req, res) => {
  var update = { TenTacGia: req.body.TenTacGia };
  TacGia.findByIdAndUpdate(req.params.id, update, function (err, item) {
    if (err) {
      res.render("../views/author/updateAuthor", { message: 0, item });
    } else {
      res.redirect("/author");
    }
  });
});
//#endregion
//#region admin
//trang chủ
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
//show page xem admin
app.get("/admin/update", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      if (err) {
        console.log(err);
      } else {
        res.render("../views/user/currentAdmin", { item });
      }
    });
  }
});
//#endregion
//#region category
//show page danh sách category
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
//show page update thể loại with id
app.get("/category/update/:id", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      TheLoai.findById(req.params.id, function (error, cate) {
        if (error) {
        } else {
          res.render("../views/category/updateCategory", { message: 2, item, cate });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});
//update thể loại
app.post("/category/update/:id", (req, res) => {
  var update = { TenTheLoai: req.body.TenTheLoai };
  TheLoai.findByIdAndUpdate(req.params.id, update, function (err, item) {
    if (err) {
      res.render("../views/category/updateCategory", { message: 0, item });
    } else {
      res.redirect("/category");
    }
  });
});
//#endregion
//#region user
//show page user
app.get("/user", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      TaiKhoan.find(function (err, items) {
        if (err) {
          console.log(err);
          res.render("../views/user/user", { listuser: [], item });
        } else {
          //không thể lấy ra admin tổng
          var nonAdminUsers = items.filter(function (user) {
            return user.TaiKhoan !== "admin";
          });
          console.log(nonAdminUsers);
          res.render("../views/user/user", { listuser: nonAdminUsers, item });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});
//show page tạo user
app.get("/user/create", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      res.render("../views/user/addUser", { message: 2, item });
    });
  } else {
    res.redirect("/login");
  }
});
app.post("/user/create", function (req, res) {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
      try {
        if (req.body.MatKhau != req.body.XacNhanMatKhau) {
          //thông báo xác nhận mật khẩu sai
          res.render("../views/user/addUser", { message: 1, item });
        }
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.MatKhau, salt);
        //tạo tài khoản mới
        var user = new TaiKhoan({
          TaiKhoan: req.body.TaiKhoan,
          MatKhau: hashed,
          HoTen: req.body.HoTen,
          Email: req.body.Email,
          PhanQuyen: req.body.isAdmin,
          TrangThai: req.body.isActive,
        });
        //lưu vào database
        await user.save();
        res.redirect("/user");
      } catch (err) {
        res.render("../views/user/addUser", { message: 0, item });
      }
    });
  }
});
//show page update user
app.get("/user/update/:id", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      TaiKhoan.findById(req.params.id, function (error, user) {
        if (error) {
        } else {
          //2 là thông báo bình thường
          res.render("../views/user/updateUser", { message: 2, item, user });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});
//#endregion
//#region login
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
//logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
//#endregion
//#region story
//show page danh sách story
app.get("/story", (req, res) => {
  session = req.session;
  if (session.userid) {
    TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
      Truyen.find(function (err, items) {
        if (err) {
          console.log(err);
          res.render("../views/story/story", { list: [], item });
        } else {
          res.render("../views/story/story", { list: items, item });
        }
      });
    });
  } else {
    res.redirect("/login");
  }
});
//#endregion
