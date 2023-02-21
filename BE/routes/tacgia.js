const tacgiaController = require("../controller/tacgiaController.js");
const router = require("express").Router();

//Thêm tác giả
router.post("/", tacgiaController.AddTacGia);
//Lấy toàn bộ thông tin tác giả
router.get("/", tacgiaController.GetAllTacGia);
//Lấy thông tin 1 tác giả
router.get("/:id", tacgiaController.Get1TacGia);
//Cập nhật thông tin tác giả
router.put("/:id", tacgiaController.Update1TacGia);
//xuất router
module.exports = router;
