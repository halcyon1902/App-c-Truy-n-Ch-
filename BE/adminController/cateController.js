const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const catecontroller = {
  GetCate: async (req, res) => {
    const item = req.admin;
    TheLoai.find(function (err, items) {
      if (err) {
        console.log(err);
        res.render("../views/category/category", { listcate: [], item });
      } else {
        res.render("../views/category/category", { listcate: items, item });
      }
    });
  },
  GetCreateCate: async (req, res) => {
    const item = req.admin;
    res.render("../views/category/addCategory", { message: 2, item });
  },
  PostCreateCate: async (req, res) => {
    var cate = new TheLoai({
      TenTheLoai: req.body.TenTheLoai,
    });
    const item = req.admin;
    cate.save(function (err) {
      if (err) {
        console.log("save category error:" + err);
        res.render("../views/category/addCategory", { message: 0, item });
      } else {
        console.log("save category successfully with id category :" + cate._id);
        res.render("../views/category/addCategory", { message: 1, item });
      }
    });
  },
  GetUpdateCate: async (req, res) => {
    const item = req.admin;
    TheLoai.findById(req.params.id, function (error, cate) {
      if (error) {
      } else {
        res.render("../views/category/updateCategory", {
          message: 2,
          item,
          cate,
        });
      }
    });
  },
  PostUpdateCate: async (req, res) => {
    var update = { TenTheLoai: req.body.TenTheLoai };
    TheLoai.findByIdAndUpdate(req.params.id, update, function (err, item) {
      if (err) {
        res.render("../views/category/updateCategory", { message: 0, item });
      } else {
        res.redirect("/category");
      }
    });
  },
};
module.exports = catecontroller;
