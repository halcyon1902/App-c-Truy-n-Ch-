const jwt = require("jsonwebtoken");
const { Truyen, TacGia, TheLoai, Chapter, TaiKhoan } = require("../model/model");
const authorcontroller = {
  home: async (req, res) => {
    const item = req.admin;
    const Total = await TaiKhoan.countDocuments({});
    const TotalStory = await Truyen.countDocuments({});
    const day = new Date().toISOString();
    const days = new Date(day).toLocaleDateString("en-GB");
    let newUser = 0;
    let newChap = 0;
    const taikhoan = await TaiKhoan.find();
    const chapter = await Chapter.find();
    await taikhoan.forEach((item) => {
      const dayUser = new Date(item.NgayTao).toLocaleDateString("en-GB");
      if (dayUser == days) {
        newUser = newUser + 1;
      }
    });
    await chapter.forEach((item) => {
      const dayChapter = new Date(item.NgayNhap).toLocaleDateString("en-GB");
      if (dayChapter == days) {
        newChap = newChap + 1;
      }
    });
    res.render("HomePage", { item, Total, TotalStory, day, newUser, newChap });
  },
};
module.exports = authorcontroller;
