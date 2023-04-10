const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authcontroller = {
  GetLogin: (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.render("Login", { message: "" });
        }
        res.redirect("/");
      });
    } else {
      res.render("Login", { message: "" });
    }
  },
  PostLogin: async (req, res) => {
    const admin = await TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan });
    if (!admin) {
      return res.render("Login", { message: "Sai tài khoản đăng nhập" });
    }
    const validPassword = await bcrypt.compare(req.body.MatKhau, admin.MatKhau);
    if (!validPassword) {
      return res.render("Login", { message: "Sai mật khẩu" });
    }
    if (!admin.PhanQuyen) {
      return res.render("Login", { message: "Không có quyền truy cập" });
    }
    if (admin && validPassword && admin.PhanQuyen) {
      const accessToken = jwt.sign(
        {
          id: admin.id,
          TaiKhoan: admin.TaiKhoan,
          PhanQuyen: admin.PhanQuyen,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "1d" }
      );
      res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, path: "/", sameSite: "strict" });
      res.redirect("/");
    } else {
      return res.render("Login", { message: "Tài khoản không tồn tại" });
    }
  },
  //logout
  GetLogout: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
        }
        res.clearCookie("accessToken");
        res.redirect("/");
      });
    } else {
    }
  },
};
module.exports = authcontroller;
