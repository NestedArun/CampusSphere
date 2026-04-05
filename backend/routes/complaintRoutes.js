
const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getAllComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

const { protect } = require("../middleware/authMiddleware");


// 📝 CREATE (protected)
router.post("/", protect, createComplaint);

// 📋 GET ALL (protected)
router.get("/", protect, getAllComplaints);

// 🔄 UPDATE STATUS (admin only handled in controller)
router.put("/:id", protect, updateComplaintStatus);

module.exports = router;