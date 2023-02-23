const { TheLoai } = require("../model/model");
const theloaiController = {
  //Thêm thể loại
  AddTheLoai: async (req, res) => {
    try {
      const theloai = new TheLoai(req.body);
      const saveTheLoai = await theloai.save();
      res.status(200).json(saveTheLoai);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Lấy toàn bộ Thể loại
  GetAllTheLoai: async (req, res) => {
    try {
      const theloai = await TheLoai.find();
      res.status(200).json(theloai);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Lấy thông tin 1 thể loại
  Get1TheLoai: async (req, res) => {
    try {
      const theloai = await TheLoai.findById(req.params.id);
      res.status(200).json(theloai);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Cập nhật thông tin thể loại
  Update1TheLoai: async (req, res) => {
    try {
      const theloai = await TheLoai.findById(req.params.id);
      await theloai.updateOne({ $set: req.body });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
// xuất controller
module.exports = theloaiController;