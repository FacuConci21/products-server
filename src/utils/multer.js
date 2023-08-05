const multer = require("multer");
const { join } = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(process.cwd(), "src", "public", "img"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploader = multer({ storage });

module.exports = uploader;
