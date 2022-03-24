// file app/product/router.js
const multer = require("multer");
const os = require("os");

// (1) import router dari express
const router = require("express").Router();

// (2) import product controller
const productController = require("./controller");

// (3) pasangkan route endpoint dengan method `store`
router.post(
  "/products",
  multer({ dest: os.tmpdir() }).single("image"),
  productController.store
);

// route baru untuk mendapatkan daftar produk
router.get("/products", productController.index);

// (4) export router
module.exports = router;
