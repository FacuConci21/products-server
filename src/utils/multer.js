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
  // Tuve que deshabilitarla porque me daba conflictos cuando creaba desde el Form
  if (file.mimetype !== "image/png") {
    return cb("Solo se admiten imagenes");
  }
  cb(null, true);
};

const uploader = multer({ storage });

module.exports = uploader;
