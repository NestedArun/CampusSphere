const express = require("express");
const router = express.Router();

const {
  createEvent,
  getAllEvents,
  registerForEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createEvent);
router.get("/", protect, getAllEvents);
router.post("/register/:id", protect, registerForEvent);

module.exports = router;