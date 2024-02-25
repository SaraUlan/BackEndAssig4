const multer = require("multer");
const path = require("path");

const profileAvaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../public/images/uploads/user_avas")
    );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const categoryIconStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../public/images/uploads/category_icons")
    );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const articleStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../../public/images/uploads/article_images")
    );
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const profileAvaUpload = multer({ storage: profileAvaStorage });
const categoryIconUpload = multer({ storage: categoryIconStorage });
const articleUpload = multer({
  storage: articleStorage,
});

module.exports = {
  profileAvaUpload,
  categoryIconUpload,
  articleUpload,
};
