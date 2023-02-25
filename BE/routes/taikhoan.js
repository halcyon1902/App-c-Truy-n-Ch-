const taikhoanController = require("../controller/taikhoanController");
const router = require("express").Router();
//Thêm tài khoản
router.post("/", taikhoanController.AddTaiKhoan);
//Lấy thông tin 1 tài khoản
router.get("/:id", taikhoanController.Get1TaiKhoan);
//Cập nhật thông tin tài khoản
router.put("/:id", taikhoanController.Update1TaiKhoan);
//Cập nhật thông tin mật khẩu
router.put("/UpdateMatKhau/:id", taikhoanController.UpdateMatKhau);
//đăng nhập
router.post("/login", taikhoanController.loginUser);
//Lấy toàn bộ thông tin tài khoản
router.get("/", taikhoanController.GetAllTaiKhoan);
//xuất router
module.exports = router;
