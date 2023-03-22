const truyenController = require("../controller/truyenController");
const router = require("express").Router();
//Thêm truyện
router.post("/", truyenController.AddTruyen);
//Lấy toàn bộ thông tin truyện
router.get("/", truyenController.GetAllTruyen);
//Lấy thông tin 1 truyện
router.get("/:id", truyenController.Get1Truyen);
//xuất router
module.exports = router;
