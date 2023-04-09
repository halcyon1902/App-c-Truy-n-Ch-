const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");

const authorcontroller = {
  GetAuthor: async (req, res) => {
    item = req.admin;
    TacGia.find(function (err, items) {
      if (err) {
        console.log(err);
        res.render("../views/author/author", { listauthor: [], item });
      } else {
        res.render("../views/author/author", { listauthor: items, item });
      }
    });
  },
  GetCreateAuthor: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, item) => {
        res.render("../views/author/addAuthor", { message: 2, item });
      });
    } else {
      console.log("Chưa đăng nhập");
      res.redirect("/login");
    }
  },
  PostCreateAuthor: async (req, res) => {
    var author = new TacGia({
      TenTacGia: req.body.TenTacGia,
    });
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, item) => {
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
  },
  GetUpdateAuthor: async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, item) => {
        TacGia.findById(req.params.id, function (error, author) {
          if (error) {
          } else {
            res.render("../views/author/updateAuthor", {
              message: 2,
              item,
              author,
            });
          }
        });
      });
    } else {
      res.redirect("/login");
    }
  },
  PostUpdateAuthor: async (req, res) => {
    var update = { TenTacGia: req.body.TenTacGia };
    TacGia.findByIdAndUpdate(req.params.id, update, function (err, item) {
      if (err) {
        res.render("../views/author/updateAuthor", { message: 0, item });
      } else {
        res.redirect("/author");
      }
    });
  },
};
module.exports = authorcontroller;
