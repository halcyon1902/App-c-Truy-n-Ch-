const { Truyen, TacGia, TheLoai, TaiKhoan } = require("../model/model");
const truyenController = {
  //Thêm truyện
  AddTruyen: async (req, res) => {
    try {
      const newTruyen = new Truyen(req.body);
      const saveTruyen = await newTruyen.save();
      res.status(200).json(saveTruyen);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //lấy toàn bộ truyện
  GetAllTruyen: async (req, res) => {
    try {
      const allTruyen = await Truyen.find()
        .populate("Chapters")
        .populate({
          path: "Chapters",
          populate: { path: "BinhLuans" },
        })
        .populate({
          path: "Chapters",
          populate: {
            path: "BinhLuans",
            populate: { path: "TaiKhoan" },
          },
        });
      res.status(200).json(allTruyen);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // lay 6 truyen co luot xem cao nhat
  GetTruyenTheoLuotXem: async (req, res) => {
    try {
      const listTruyenHot = await Truyen.find()
        .populate("Chapters")
        .populate({
          path: "Chapters",
          populate: { path: "BinhLuans" },
        })
        .populate({
          path: "Chapters",
          populate: {
            path: "BinhLuans",
            populate: { path: "TaiKhoan" },
          },
        })
        .sort({ LuotXem: -1 })
        .limit(6);
      res.status(200).json(listTruyenHot);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // lay 6 truyen moi nhat
  GetTruyenMoi: async (req, res) => {
    try {
      const listTruyenMoi = await Truyen.find()
        .populate("Chapters")
        .populate({
          path: "Chapters",
          populate: { path: "BinhLuans" },
        })
        .populate({
          path: "Chapters",
          populate: {
            path: "BinhLuans",
            populate: { path: "TaiKhoan" },
          },
        })
        .sort({ NgayCapNhat: -1 })
        .limit(6);
      res.status(200).json(listTruyenMoi);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //lấy thông tin 1 truyện
  Get1Truyen: async (req, res) => {
    try {
      const truyen = await Truyen.findById(req.params.id)
        .populate("Chapters")
        .populate({
          path: "Chapters",
          populate: { path: "BinhLuans" },
        })
        .populate({
          path: "Chapters",
          populate: {
            path: "BinhLuans",
            populate: { path: "TaiKhoan" },
          },
        });
      res.status(200).json(truyen);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //cập nhật thông tin truyện
  Update1Truyen: async (req, res) => {
    try {
      // const là chúng ta sẽ không thể tái khai báo hay cập nhật giá trị mới để thay thế cho giá trị trước đó của biến.
      const truyen = await Truyen.findById(req.params.id);
      await truyen.updateOne({ $set: req.body });
      res.status(200).json("Updated successful");
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //tìm kiếm truyện theo tên truyện
  SearchTruyen: async (req, res) => {
    try {
      // let cho phép chúng ta cập nhật giá trị của biến chứ không cho phép chúng ta tái khái báo lại biến đó.
      const tacgia = await TacGia.findOne({ TenTacGia: req.params.key });

      // neu params la ten tac gia
      if (tacgia != null) {
        let data = await Truyen.find({ TacGias: tacgia.id })
          .populate("Chapters")
          .populate({
            path: "Chapters",
            populate: { path: "BinhLuans" },
          })
          .populate({
            path: "Chapters",
            populate: {
              path: "BinhLuans",
              populate: { path: "TaiKhoan" },
            },
          });
        if (data.length == 0) {
          res.status(200).json("tác giả không có truyện");
        } else {
          res.status(200).json(data);
        }
      } else {
        //neu params la ten truyen
        let data = await Truyen.find({
          $or: [
            { TenTruyen: { $regex: req.params.key, $options: "i" } }, // $option: 'i' => để k phân biệt chữ hoa - thường
          ],
        })
          .populate("Chapters")
          .populate({
            path: "Chapters",
            populate: { path: "BinhLuans" },
          })
          .populate({
            path: "Chapters",
            populate: {
              path: "BinhLuans",
              populate: { path: "TaiKhoan" },
            },
          });
        if (data != null) {
          res.status(200).json(data);
        } else {
          res.status(200).json("Không Tìm Thấy Kết Quả!");
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Tìm kiếm truyện theo tác giả
  SearchTruyenTheoTacGia: async (req, res) => {
    try {
      const tacgia = await TacGia.findOne({ TenTacGia: req.params.key });
      if (tacgia != null) {
        let data = await Truyen.find({ TacGias: tacgia.id })
          .populate("Chapters")
          .populate({
            path: "Chapters",
            populate: { path: "BinhLuans" },
          })
          .populate({
            path: "Chapters",
            populate: {
              path: "BinhLuans",
              populate: { path: "TaiKhoan" },
            },
          });
        if (data.length == 0) {
          res.status(200).json("tác giả không có truyện");
        } else {
          res.status(200).json(data);
        }
      } else {
        res.status(200).json("Tác giả không tồn tại");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //Tìm kiếm truyện theo thể loại
  SearchTruyenTheoTheLoai: async (req, res) => {
    try {
      const theloai = await TheLoai.findOne({ TenTheLoai: req.params.key });
      if (theloai != null) {
        let data = await Truyen.find({
          TheLoais: theloai.id,
        })
          .populate("Chapters")
          .populate({
            path: "Chapters",
            populate: { path: "BinhLuans" },
          })
          .populate({
            path: "Chapters",
            populate: {
              path: "BinhLuans",
              populate: { path: "TaiKhoan" },
            },
          });
        if (data.length == 0) res.status(200).json("Thể lọai không có truyện");
        else res.status(200).json(data);
      } else {
        res.status(200).json("Thể Loại không tồn tại");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
//xuất router
module.exports = truyenController;
