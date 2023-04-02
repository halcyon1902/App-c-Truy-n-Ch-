const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("../model/model");
const usercontroller = {
  GetStory: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, function (err, item) {
        Truyen.find(function (err, items) {
          if (err) {
            console.log(err);
            res.render("../views/story/story", { list: [], item });
          } else {
            res.render("../views/story/story", { list: items, item });
          }
        });
      });
    } else {
      res.redirect("/login");
    }
  },
  //show page tạo user
  GetCreateStory: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        const author = await TacGia.find();
        const category = await TheLoai.find();
        res.render("../views/story/addStory", { message: 2, item, author, category });
      });
    } else {
      res.redirect("/login");
    }
  },
  //thêm truyện
  PostCreateStory: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        try {
          const truyen = new Truyen({
            TenTruyen: req.body.TenTruyen,
            GioiThieu: req.body.GioiThieu,
            AnhBia: req.body.AnhBia,
            TacGia: req.body.TacGia,
            TheLoais: req.body.showSelectedCategoriesIds,
            TinhTrang: req.body.isDone,
          });
          console.log(truyen);
          await truyen.save();
          res.redirect("/story");
        } catch (err) {
          console.log(err);
          const author = await TacGia.find();
          const category = await TheLoai.find();
          res.render("../views/story/addStory", { message: 0, item, author, category });
        }
      });
    }
  },
  //chi tiết truyện
  GetDetailStory: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        try {
          const truyen = await Truyen.findById(req.params.id).populate("Chapters");
          const tacgia = truyen.TacGia;
          const author = await TacGia.findById(tacgia);
          const theloai = truyen.TheLoais.toString();
          const temp = theloai.split(",").map((str) => str.trim());
          async function retrieveAsync() {
            const tempArray = [];
            for (const id of temp) {
              try {
                const item2 = await TheLoai.findById(id).exec();
                if (item2) {
                  tempArray.push(item2.TenTheLoai);
                }
              } catch (err) {
                console.error(err);
              }
            }
            return tempArray; // Trả về kết quả cho hàm
          }
          const tempArray = await retrieveAsync(); // Lấy danh sách thể loại bằng cách gọi hàm
          res.render("../views/story/detailStory", { truyen, item, author, tempArray });
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      res.redirect("/login");
    }
  },
  // Show update story form
  GetUpdateStory: async (req, res) => {
    try {
      const session = req.session;
      if (!session.userid) {
        return res.redirect("/story");
      }
      const item = await TaiKhoan.findOne({ TaiKhoan: session.userid });
      const truyen = await Truyen.findById(req.params.id);
      const authors = await TacGia.find();
      const categories = await TheLoai.find();
      const theloai = truyen.TheLoais.toString();
      const temp = theloai.split(",").map((str) => str.trim());
      async function retrieveAsync() {
        const selectedCategories = [];
        for (const id of temp) {
          try {
            const item2 = await TheLoai.findById(id).exec();
            if (item2) {
              selectedCategories.push(item2.TenTheLoai);
            }
          } catch (err) {
            console.error(err);
          }
        }
        return selectedCategories; // Trả về kết quả cho hàm
      }
      // Get the list of selected categories
      const selectedCategories = await retrieveAsync();
      // Render the form with selected categories
      res.render("../views/story/updateStory", { message: 2, truyen, item, authors, categories, author: authors, selectedCategories });
    } catch (err) {
      console.log(err);
      res.redirect("/story");
    }
  },
  //update truyện
  PostUpdateStory: async (req, res) => {
    try {
      const truyen = await Truyen.findById(req.params.id);
      if (!truyen) {
        return res.render("../views/story/updateStory", { message: 0 });
      }
      // Retrieve selected categories
      const theloai = req.body.theloai || []; // Empty array if no category is selected
      const showSelectedCategories = await Promise.all(
        theloai.map(async (categoryName) => {
          try {
            const category = await TheLoai.findOne({ TenTheLoai: categoryName }).exec();
            return category ? category._id : null; // Return category ID instead of object
          } catch (err) {
            console.error(err);
            return null;
          }
        })
      );
      const update = {
        TenTruyen: req.body.TenTruyen,
        GioiThieu: req.body.GioiThieu,
        AnhBia: req.body.AnhBia,
        TacGia: req.body.TacGia,
        TheLoais: showSelectedCategories.filter((category) => category !== null),
        TinhTrang: req.body.isEnable,
        TrangThai: req.body.isActive,
      };
      await truyen.updateOne(update);
      res.redirect("/story");
    } catch (err) {
      console.log(err);
      res.redirect("/story");
    }
  },
  //show chapter detail
  PostUpdateAuthor: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        try {
          const chapter = await Chapter.findById(req.params.id);
          res.render("../views/chapter/detailChapter", { chapter, item });
        } catch (err) {
          res.status(500).json(err);
        }
      });
    } else {
      res.redirect("/login");
    }
  },
  PostUpdateAuthor: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        try {
          const truyen = await Truyen.findById(req.params.id);
          res.render("../views/chapter/addChapter", { item, truyen, message: 2 });
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      res.redirect("/login");
    }
  },
  PostUpdateAuthor: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        const truyen = await Truyen.findById(req.params.id);
        try {
          const chapter = new Chapter({
            TenChapter: req.body.TenChapter,
            NoiDung: req.body.NoiDung,
            Truyen: req.params.id,
          });
          const saveChapter = await chapter.save();
          await truyen.updateOne({ $push: { Chapters: saveChapter._id } }, { $set: { NgayCapNhat: new Date() } });
          res.render("../views/chapter/addChapter", { item, truyen, message: 1 });
        } catch (err) {
          console.log(err);
          res.render("../views/chapter/addChapter", { item, truyen, message: 0 });
        }
      });
    }
  },
  //show chapter detail
  PostUpdateAuthor: async (req, res) => {
    session = req.session;
    if (session.userid) {
      TaiKhoan.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        try {
          const chapter = await Chapter.findById(req.params.id);
          res.render("../views/chapter/detailChapter", { chapter, item });
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      res.redirect("/story");
    }
  },
  //show update chapter
  PostUpdateAuthor: async (req, res) => {
    session = req.session;
    if (session.userid) {
      Chapter.findOne({ TaiKhoan: session.userid }, async function (err, item) {
        try {
          const chapter = await Chapter.findById(req.params.id);
          console.log(chapter);
          res.render("../views/chapter/updateChapter", { message: 2, chapter, item });
        } catch (err) {
          console.log(err);
        }
      });
    } else {
      res.redirect("/story");
    }
  },
  ////update chapter
  PostUpdateAuthor: async (req, res) => {
    var update = {
      TenChapter: req.body.TenChapter,
      NoiDung: req.body.NoiDung,
      TrangThai: req.body.isActive,
    };
    Chapter.findByIdAndUpdate(req.params.id, update, function (err, item) {
      if (err) {
        res.render("../views/chapter/updateChapter", { message: 0, item });
      } else {
        res.redirect("/story");
      }
    });
  },
};
module.exports = usercontroller;
