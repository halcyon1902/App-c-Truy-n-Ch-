const jwt = require("jsonwebtoken");
const authorcontroller = {
  home: async (req, res) => {
    const item = req.admin;
    res.render("HomePage", { item });
  },
};
module.exports = authorcontroller;
