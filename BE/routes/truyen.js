const truyenController = require("../controller/truyenController");
const router = require("express").Router();
//Thêm truyện
router.post("/", truyenController.AddTruyen);
//Lấy toàn bộ thông tin truyện
router.get("/", truyenController.GetAllTruyen);
//Lấy 6 truyện có lượt xem cao nhất
router.get("/TruyenTheoLuotXem", truyenController.GetTruyenTheoLuotXem);
//Lấy 6 truyện moi nhat
router.get("/TruyenMoi", truyenController.GetTruyenMoi);
//Lấy thông tin 1 truyện
router.get("/:id", truyenController.Get1Truyen);
//Cập nhật thông tin truyện
router.put("/:id", truyenController.Update1Truyen);
//Tìm kiếm theo thể loại và tên
router.get("/SearchTruyen/:key", truyenController.SearchTruyen);
//Tìm kiếm theo tên tác giả
router.get(
  "/SearchTruyenTheoTacGia/:key",
  truyenController.SearchTruyenTheoTacGia
);
//Tìm Kiếm truyện theo thể loại
router.get(
  "/SearchTruyenTheoTheLoai/:key",
  truyenController.SearchTruyenTheoTheLoai
);
//xuất router
module.exports = router;
