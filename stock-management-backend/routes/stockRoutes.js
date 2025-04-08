const express = require("express");
const {
  uploadStock,
  getStock,
  searchStock,
  getStockById,
} = require("../controllers/stockController");
const upload = require("../middleware/fileUpload");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadStock);
router.get("/stocks", auth, getStock);
router.get("/search", auth, searchStock);
router.get("/stocks/:id", auth, getStockById);

module.exports = router;
