
const express = require("express");
const router = express.Router();

const {
  createItem,
  getAllItems,
} = require("../controllers/lostFoundController");

const { protect } = require("../middleware/authMiddleware");


// 📝 CREATE ITEM (PROTECTED)
router.post("/", protect, createItem);

// 📋 GET ALL ITEMS (PUBLIC)
router.get("/", getAllItems);

module.exports = router;