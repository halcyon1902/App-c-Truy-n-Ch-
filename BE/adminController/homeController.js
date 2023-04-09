const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const authorcontroller = {
  home: async (req, res) => {
    item = req.admin;
    console.log(item);
    res.render("HomePage", { item });
  },
};
module.exports = authorcontroller;
