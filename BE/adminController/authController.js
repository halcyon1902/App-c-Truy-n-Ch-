const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authcontroller = {
  GetLogin: (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          res.render("Login", { message: 2 });
        }
        res.redirect("/");
      });
    } else {
      res.render("Login", { message: 2 });
    }
  },
  PostLogin: async (req, res) => {
    try {
      const admin = await TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan });
      if (!admin) {
        return res.render("Login", { message: 1 });
      }
      const validPassword = await bcrypt.compare(req.body.MatKhau, admin.MatKhau);
      if (!validPassword) {
        return res.render("Login", { message: 0 });
      }
      if (!admin.PhanQuyen) {
        return res.render("Login", { message: 3 });
      }
      if (admin && validPassword && admin.PhanQuyen) {
        const accessToken = jwt.sign(
          {
            id: admin.id,
            TaiKhoan: admin.TaiKhoan,
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "1d" }
        );
        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, path: "/", sameSite: "strict" });
        res.redirect("/");
      } else {
        return res.render("Login", { message: 4 });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
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
