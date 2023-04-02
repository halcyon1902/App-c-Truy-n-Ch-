const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("../model/model");
const authorcontroller = {
  home: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
        res.render("HomePage", { item });
      });
    } else {
      res.redirect("/login");
    }
  },
};
module.exports = authorcontroller;
