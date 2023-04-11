const mongoose = require("mongoose");
//#region tác giả
const TacGiaSchema = new mongoose.Schema({
  TenTacGia: {
    type: String,
    required: true,
    unique: true,
  },
});
//#endregion
//#region thể loại
const TheLoaiSchema = new mongoose.Schema({
  TenTheLoai: {
    type: String,
    required: true,
    unique: true,
  },
});
//#endregion
//#region truyện
const TruyenSchema = new mongoose.Schema({
  TenTruyen: {
    type: String,
    required: true,
  },
  TheLoais: {
    type: [String],
    required: true,
  },
  TrangThai: {
    type: Boolean,
    default: true,
    required: true,
  },
  TinhTrang: {
    type: Boolean,
    default: false,
    required: true,
  },
  GioiThieu: {
    type: String,
  },
  AnhBia: {
    type: String,
  },
  TacGia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TacGia",
  },
  Chapters: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    },
  ],
});
//#endregion
//#region tài khoản
const TaiKhoanSchema = new mongoose.Schema({
  TaiKhoan: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 20,
    unique: true,
  },
  MatKhau: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    unique: true,
    required: true,
  },
  HoTen: {
    type: String,
    require: true,
  },
  NgayTao: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
  PhanQuyen: {
    type: Boolean,
    default: false,
    required: true,
  },
  TrangThai: {
    type: Boolean,
    default: true,
    required: true,
  },
  LichSu: {
    type: [String],
  },
  YeuThich: {
    type: [String],
  },
});
//#endregion
//#region chapter
const ChapterSchema = new mongoose.Schema({
  TenChapter: {
    type: String,
    required: true,
  },
  NgayNhap: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
  TrangThai: {
    type: Boolean,
    default: true,
    required: true,
  },
  Truyen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Truyen",
  },
  LuotXem: {
    type: Number,
    default: 0,
  },
  NoiDung: {
    type: String,
  },
});
//#endregion
//=======================tạo model=======================
let TacGia = mongoose.model("TacGia", TacGiaSchema);
let Truyen = mongoose.model("Truyen", TruyenSchema);
let TaiKhoan = mongoose.model("TaiKhoan", TaiKhoanSchema);
let Chapter = mongoose.model("Chapter", ChapterSchema);
let TheLoai = mongoose.model("TheLoai", TheLoaiSchema);
module.exports = { Truyen, TacGia, TaiKhoan, Chapter, TheLoai };
