const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
let refreshTokenList = [];
const authcontroller = {
  login: async (req, res) => {
    try {
      const admin = await TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan });

      if (!admin) {
        return res.status(404).json("Wrong username!");
      }
      const validPassword = await bcrypt.compare(req.body.MatKhau, admin.MatKhau);
      if (!validPassword) {
        return res.status(404).json("Wrong password!");
      }
      if (!admin.PhanQuyen) {
        return res.status(403).json("không phải admin");
      }

      if (admin && validPassword) {
        //ACCESS TOKEN
        const accessToken = jwt.sign(
          {
            id: admin.id,
            PhanQuyen: admin.PhanQuyen,
          },
          process.env.JWT_ACCESS_KEY,
          { expiresIn: "1d" }
        );

        //REFRESH TOKEN
        const refreshToken = jwt.sign(
          {
            id: admin.id,
            PhanQuyen: admin.PhanQuyen,
          },
          process.env.JWT_REFRESH_TOKEN,
          { expiresIn: "7d" }
        );

        refreshTokenList.push(refreshToken);

        //SAVE REFRESH TOKEN TO COOKIES
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { MatKhau, ...others } = admin._doc;
        res.status(200).json({
          message: "Successfully!",
          others,
          accessToken,
        });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json("You're not authenticated");
    }

    if (!refreshTokenList.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, admin) => {
      if (err) {
        console.log(err);
      }

      refreshTokenList = refreshTokenList.filter((token) => token !== refreshToken);
      //CREATE NEW ACCESS TOKEN, REFRESH TOKEN
      const newAccessToken = jwt.sign(
        {
          id: admin._id,
          PhanQuyen: admin.PhanQuyen,
        },
        process.env.JWT_ACCESS_TOKEN,
        { expiresIn: "30d" }
      );

      const newRefreshToken = jwt.sign(
        {
          id: admin._id,
          PhanQuyen: admin.PhanQuyen,
        },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: "90d" }
      );

      refreshTokenList.push(newRefreshToken);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  },
  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokenList = refreshTokenList.filter((token) => token !== req.cookies.refreshToken);
    res.status(200).json("logout");
  },
  GetLogin: (req, res) => {
    session = req.session;
    if (session.userid) {
      res.redirect("/");
    } else {
      //2 là bình thường
      res.render("Login", { message: 2 });
    }
  },
  PostLogin: (req, res) => {
    TaiKhoan.findOne({ TaiKhoan: req.body.TaiKhoan }, async function (err, item) {
      if (!err && item != null) {
        const valid = await bcrypt.compare(req.body.MatKhau, item.MatKhau);
        const role = item.PhanQuyen;
        const status = item.TrangThai;
        if (valid) {
          // đúng mật khẩu
          if (role && status) {
            session = req.session;
            session.userid = req.body.TaiKhoan;
            res.redirect("/");
          } else {
            //không có quyền truy cập
            res.render("Login", { message: 3 });
          }
        } else {
          //sai mật khẩu là 0
          res.render("Login", { message: 0 });
        }
      } else {
        //sai tài khoản là 1
        res.render("Login", { message: 1 });
      }
    });
  },
  GetLogout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  },
};
module.exports = authcontroller;
