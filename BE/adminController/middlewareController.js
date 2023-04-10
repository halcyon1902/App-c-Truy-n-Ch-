const jwt = require("jsonwebtoken");
const { TaiKhoan } = require("../model/model");
const middlewareController = {
  verifyTokenAndAdmin: (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, item) => {
        console.log(item);
        if (err) {
          res.redirect("/login");
        } else {
          TaiKhoan.findOne({ TaiKhoan: item.TaiKhoan }, function (err, admin) {
            req.admin = admin;
            next();
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  },
  verifyToken: (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, process.env.JWT_RESETPASS_TOKEN, async (err, item) => {
        if (err) {
          res.redirect("/login");
        } else {
          TaiKhoan.findOne({ TaiKhoan: item.TaiKhoan }, function (err, admin) {
            req.admin = admin;
            next();
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};
module.exports = middlewareController;
