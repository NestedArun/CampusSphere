// backend/routes/announcementRoutes.js

const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
  getAnnouncements,
  toggleAnnouncement,
} = require("../controllers/announcementController");

const { protect } = require("../middleware/authMiddleware");


// 📝 CREATE (admin)
router.post("/", protect, createAnnouncement);

// 📋 GET ALL ACTIVE
router.get("/", protect, getAnnouncements);

// 🔄 TOGGLE ACTIVE (admin)
router.put("/:id", protect, toggleAnnouncement);

module.exports = router;