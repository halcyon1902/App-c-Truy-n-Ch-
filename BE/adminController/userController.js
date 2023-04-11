const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usercontroller = {
  GetUser: async (req, res) => {
    const item = req.admin;
    TaiKhoan.find(async function (err, items) {
      if (err) {
        console.log(err);
        res.render("../views/user/user", { listuser: [], item });
      } else {
        //không thể lấy ra admin lớn nhất
        var nonAdminUsers = await items.filter(function (user) {
          return user.TaiKhoan !== "admin";
        });
        res.render("../views/user/user", { listuser: nonAdminUsers, item });
      }
    });
  },
  GetCreateUser: async (req, res) => {
    const item = req.admin;
    res.render("../views/user/addUser", { message: 2, item });
  },
  PostCreateUser: async (req, res) => {
    const item = req.admin;
    try {
      if (req.body.MatKhau != req.body.XacNhanMatKhau) {
        //thông báo xác nhận mật khẩu sai
        return res.render("../views/user/addUser", { message: 1, item });
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
      console.log(err);
      res.render("../views/user/addUser", { message: 0, item });
    }
  },
  GetUpdateUser: async (req, res) => {
    const item = req.admin;
    TaiKhoan.findById(req.params.id, function (error, user) {
      if (error) {
      } else {
        //2 là thông báo bình thường
        res.render("../views/user/updateUser", { message: 2, item, user });
      }
    });
  },
  PostUpdateUser: async (req, res) => {
    const item = req.admin;
    var update = {
      TaiKhoan: req.body.TaiKhoan,
      HoTen: req.body.HoTen,
      Email: req.body.Email,
      PhanQuyen: req.body.isAdmin,
      TrangThai: req.body.isActive,
    };
    TaiKhoan.findByIdAndUpdate(req.params.id, update, function (err, user) {
      if (err) {
        //2 là thông báo bình thường
        res.render("../views/user/updateUser", { message: 2, item, user });
      } else {
        res.redirect("/user");
      }
    });
  },
  //show update admin
  GetUpdateAdmin: async (req, res) => {
    const item = req.admin;
    TaiKhoan.findById(item.id, function (error, user) {
      if (error) {
      } else {
        //2 là thông báo bình thường
        res.render("./../views/user/updateAdmin", { message: 2, item, user });
      }
    });
  },
  //update admin
  PostUpdateAdmin: async (req, res) => {
    const item = req.admin;
    var update = {
      TaiKhoan: req.body.TaiKhoan,
      HoTen: req.body.HoTen,
      Email: req.body.Email,
    };
    TaiKhoan.findByIdAndUpdate(req.params.id, update, function (err, user) {
      if (err) {
        //2 là thông báo bình thường
        res.render("../views/user/updateAdmin", { message: 2, item, user });
      } else {
        res.redirect("/login");
      }
    });
  },
};
module.exports = usercontroller;
