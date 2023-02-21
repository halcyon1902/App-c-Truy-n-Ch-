const { Truyen, TacGia } = require("../model/model");
const tacgiaController = {
  //Thêm tác giả
  AddTacGia: async (req, res) => {
    try {
      const tacgiamoi = new TacGia(req.body);
      const saveTacGia = await tacgiamoi.save();
      res.status(200).json(saveTacGia);
    } catch (err) {
      res.status(500).json(err); // search google: http request code nếu muốn biết code nghĩa là gì
    }
  },
  //Lấy toàn bộ tác giả
  GetAllTacGia: async (req, res) => {
    try {
      const allTacGia = await TacGia.find();
      res.status(200).json(allTacGia);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Lấy thông tin 1 tác giả
  Get1TacGia: async (req, res) => {
    try {
      const tacgia = await TacGia.findById(req.params.id); //.populate("Truyens");
      res.status(200).json(tacgia);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Cập nhật thông tin tác giả
  Update1TacGia: async (req, res) => {
    try {
      const tacgia = await TacGia.findById(req.params.id);
      await tacgia.updateOne({ $set: req.body });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
// xuất controller
module.exports = tacgiaController;
