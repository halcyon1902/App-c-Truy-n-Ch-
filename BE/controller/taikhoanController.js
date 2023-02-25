const { Truyen, TacGia, TaiKhoan } = require("../model/model");
const bcrypt = require("bcrypt");
const taikhoanController = {
  //Thêm tài khoản
  AddTaiKhoan: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.MatKhau, salt);
      //tạo tài khoản mới
      const taikhoan = new TaiKhoan({
        TaiKhoan: req.body.TaiKhoan,
        MatKhau: hashed,
        Email: req.body.Email,
        HoTen: req.body.HoTen,
      });
      //lưu vào database
      const saveTaiKhoan = await taikhoan.save();
      res.status(200).json(saveTaiKhoan);
    } catch (err) {
      res.status(500).json(err);
    }
  }, //Lấy toàn bộ tài khoản
  GetAllTaiKhoan: async (req, res) => {
    try {
      const taikhoan = await TaiKhoan.find();
      res.status(200).json(taikhoan);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Lấy thông tin 1 tài khoản
  Get1TaiKhoan: async (req, res) => {
    try {
      const taikhoan = await TaiKhoan.findById(req.params.id);
      res.status(200).json(taikhoan);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Cập nhật thông tin tài khoản
  Update1TaiKhoan: async (req, res) => {
    try {
      const taikhoan = await TaiKhoan.findById(req.params.id);
      await taikhoan.updateOne({ $set: req.body });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan });
      if (!user) {
        return res.status(404).json("Sai tên tài khoản");
      }
      const validPassword = await bcrypt.compare(
        req.body.MatKhau,
        user.MatKhau
      );
      if (!validPassword) {
        return res.status(404).json("Sai mật khẩu");
      }
      if (user && validPassword) {
        res.status(200).json(user);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  home(req, res) {
    res.render("home");
  },
  //Cập nhật thông tin mật khẩu
  UpdateMatKhau: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.MatKhau, salt);
      const taikhoan = await TaiKhoan.findById(req.params.id);
      await taikhoan.updateOne({ $set: { MatKhau: hashed } });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

// xuất controller
module.exports = taikhoanController;
