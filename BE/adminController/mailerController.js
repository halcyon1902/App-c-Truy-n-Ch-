const { TaiKhoan } = require("../model/model");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const authcontroller = {
  GetMailer: (req, res) => {
    res.render("Mailer.ejs");
  },
  PostMailer: async (req, res) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const admin = await TaiKhoan.findOne({ Email: req.body.mail });
    console.log(admin);
    const token = await jwt.sign(
      {
        id: admin.id,
      },
      process.env.JWT_RESETPASS_TOKEN,
      { expiresIn: "600" }
    );
    const content = `
    <div style="max-width: 600px; margin: auto">
      <div style="background-color: #003375; padding: 20px; text-align: center">
        <img src="https://balsamiq.com/assets/company/brandassets/smileyface-transparent-1080x1080.png" alt="Logo" style="width: 200px">
      </div>
      <div style="padding: 20px">
        <h3>Xin chào,</h3>
        <p>Bạn đã gửi yêu cầu khôi phục mật khẩu. Đây là đường link để cập nhật mật khẩu mới:</p>
        <p><a href="http://localhost:8000/resetPass/reset" style="color: #0085ff">Thay đổi mật khẩu</a></p>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, thì hãy bỏ qua email này.</p>
        <p style="font-style: italic">Email này được tự động tạo ra, vui lòng không trả lời lại.</p>
      </div>
    </div>
  `;
    var data = {
      from: "ReadingApp",
      to: req.body.mail,
      subject: "Recovery Password",
      html: content,
    };
    transporter.sendMail(data, function (err, info) {
      if (err) {
        console.log(err);
        res.redirect("/resetPass");
      } else {
        res.cookie("token", token, { httpOnly: true, secure: true, path: "/", sameSite: "strict" });
        res.redirect("/login");
      }
    });
  },
  GetUpdate: (req, res) => {
    res.render("ResetPassForm");
  },
  PostUpdate: async (req, res) => {
    try {
      const token = req.cookies.token;
      console.log(token);
      if (token) {
        jwt.verify(token, process.env.JWT_RESETPASS_TOKEN, async (err, item) => {
          console.log(item);
          if (err) {
            console.log(err);
          }
          const taikhoan = await TaiKhoan.findById(item.id, async function (error, items) {
            console.log(items);
            if (error) {
              const message = "Thay đổi mật khẩu không thành công";
              console.log(err);
              res.render("ResetPass", message);
            } else {
              const salt = await bcrypt.genSalt(10);
              const hashed = await bcrypt.hash(req.body.MatKhau, salt);
              await taikhoan.updateOne({ $set: { MatKhau: hashed } });
              const message = "Thay đổi mật khẩu thành công";
              res.render("ResetPass", message);
            }
          });
        });
      }
    } catch (err) {
      const message = "Thay đổi mật khẩu thành công";
      res.render("ResetPass", message);
    }
  },
};
module.exports = authcontroller;
