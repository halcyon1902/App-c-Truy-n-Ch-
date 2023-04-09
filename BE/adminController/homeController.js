const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const authorcontroller = {
  home: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
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
