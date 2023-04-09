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
    const token = await jwt.sign(
      {
        id: admin.id,
        TaiKhoan: admin.TaiKhoan,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: "10m" }
    );
    console.log("token:" + token);
    const url = "http://localhost:8000/auth/reset_password/" + token;
    const content = `
    <div style="max-width: 600px; margin: auto">
      <div style="background-color: #003375; padding: 20px; text-align: center">
        <img src="https://balsamiq.com/assets/company/brandassets/smileyface-transparent-1080x1080.png" alt="Logo" style="width: 200px">
      </div>
      <div style="padding: 20px">
        <h3>Xin chào,</h3>
        <p>Bạn đã gửi yêu cầu khôi phục mật khẩu. Đây là đường link để cập nhật mật khẩu mới:</p>
        <p><a href="<%= url %>" style="color: #0085ff">Thay đổi mật khẩu</a></p>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, thì hãy bỏ qua email này.</p>
        <p style="font-style: italic">Email này được tự động tạo ra, vui lòng không trả lời lại.</p>
      </div>
    </div>
  `;

    var data = {
      from: "ReadingApp",
      to: req.body.mail,
      subject: "Recovery Password",
      html: content.replace("<%= url %>", url),
    };
    transporter.sendMail(data, function (err, info) {
      if (err) {
        console.log(err);
        res.redirect("/resetPass");
      } else {
        console.log(" Email sent:", info.response);
        res.redirect("/login");
      }
    });
  },
};
module.exports = authcontroller;
