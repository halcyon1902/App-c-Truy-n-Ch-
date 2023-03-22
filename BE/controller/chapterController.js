const { Truyen, Chapter } = require("../model/model");
const chapterController = {
  //Thêm Chapter
  AddChapter: async (req, res) => {
    try {
      const newChapter = new Chapter(req.body);
      const saveChapter = await newChapter.save();
      if (req.body.Truyen) {
        const truyen = Truyen.findById(req.body.Truyen);
        await truyen.updateMany({
          $push: { Chapters: saveChapter._id },
          $set: { NgayCapNhat: saveChapter.NgayNhap },
        });
      }
      res.status(200).json(saveChapter);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  Get1Chapter: async (req, res) => {
    try {
      const chapter = await Chapter.findById(req.params.id)
        .populate("BinhLuans")
        .populate({
          path: "BinhLuans",
          populate: { path: "TaiKhoan" },
        });
      res.status(200).json(chapter);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //cập nhật thông tin chapter
  Update1Chapter: async (req, res) => {
    try {
      const chapter = await Chapter.findById(req.params.id);
      await chapter.updateOne({ $set: req.body });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
//xuất router
module.exports = chapterController;
