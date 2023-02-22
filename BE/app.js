const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const tacgiaRoute = require("./routes/tacgia");
// const truyenRoute = require("./routes/Truyen");
// const taikhoanRoute = require("./routes/TaiKhoan");
// const chapterRoute = require("./routes/Chapter");
// const binhluanRoute = require("./routes/BinhLuan");
// const theloaiRoute = require("./routes/TheLoai");

//giao diện
const http = require("http");
const css = require("css");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors()); //CORS là một cơ chế cho phép nhiều tài nguyên khác nhau (fonts, Javascript, v.v…) của một trang web có thể được truy vấn từ domain khác với domain của trang
app.use(morgan("common")); // khi send request sẽ thông báo dưới terminal

var server = http.createServer(function (request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("Hello World\n");
});
server.listen(8000);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
//kết nối database
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to MongoDB successful");
});
//Routes
app.use("/TacGia", tacgiaRoute);
// app.use("/TheLoai", theloaiRoute);
// app.use("/Truyen", truyenRoute);
// app.use("/TaiKhoan", taikhoanRoute);
// app.use("/Chapter", chapterRoute);
// app.use("/BinhLuan", binhluanRoute);
//kiểm tra port hoạt động ở 8000
// const server = app.listen(process.env.PORT || 8000, () => {
//   console.log(`Server is running → PORT ${server.address().port}`);
// });
