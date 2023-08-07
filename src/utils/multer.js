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

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "image/png") {
    return cb("Solo se admiten imagenes png/jpg/jpeg");
  }
  cb(null, true);
};

const uploader = multer({ storage, fileFilter });

module.exports = uploader;
