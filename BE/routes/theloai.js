const theloaiController = require("../controller/theloaiController");
const router = require("express").Router();

//Thêm Thể Loại
router.post("/", theloaiController.AddTheLoai);
// //Lấy toàn bộ thông tin tác giả
router.get("/", theloaiController.GetAllTheLoai);
// //Lấy thông tin 1 tác giả
router.get("/:id", theloaiController.Get1TheLoai);
// //Cập nhật thông tin tác giả
router.put("/:id", theloaiController.Update1TheLoai);
//xuất router
module.exports = router;