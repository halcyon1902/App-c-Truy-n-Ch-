const { Chapter, BinhLuan, TaiKhoan } = require("../model/model");
const binhluanController = {
  //Thêm Bình luận
  AddBL: async (req, res) => {
    try {
      const newBinhLuan = new BinhLuan(req.body);
      const saveBinhLuan = await newBinhLuan.save();
      if (req.body.Chapter) {
        const binhluan = Chapter.findById(req.body.Chapter);
        await binhluan.updateMany({ $push: { BinhLuans: saveBinhLuan._id } }); // thêm id bình luận vào chapter
      }
      if (req.body.TaiKhoan) {
        const binhluan = TaiKhoan.findById(req.body.TaiKhoan);
        await binhluan.updateMany({ $push: { BinhLuans: saveBinhLuan._id } }); // thêm id bình luận vào tài khoản
      }
      res.status(200).json(saveBinhLuan);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //chỉnh sửa bình luận
  Update1BL: async (req, res) => {
    try {
      const binhluan = await BinhLuan.findById(req.params.id);
      await binhluan.updateOne({ $set: req.body });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //lấy toàn bộ bình luận
  GetAllBL: async (req, res) => {
    try {
      const bl = await BinhLuan.find();
      res.status(200).json(bl);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

//xuất router
module.exports = binhluanController;
