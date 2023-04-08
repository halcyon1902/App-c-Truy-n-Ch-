const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const authorcontroller = {
  home: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, async (err, user) => {
        if (err) {
          res.redirect("/login");
        } else {
          TaiKhoan.findOne({ TaiKhoan: user.TaiKhoan }, function (err, item) {
            res.render("HomePage", { item });
          });
        }
      });
    } else {
      res.redirect("/login");
    }
  },
};
module.exports = authorcontroller;
