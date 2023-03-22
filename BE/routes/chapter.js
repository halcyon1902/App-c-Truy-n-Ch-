const chapterController = require("../controller/chapterController");
const router = require("express").Router();
//thêm chapter
router.post("/", chapterController.AddChapter);
//Lấy thông tin 1 chapter
router.get("/:id", chapterController.Get1Chapter);
//Cập nhật chapter
router.put("/:id", chapterController.Update1Chapter);
//xuất router
module.exports = router;
