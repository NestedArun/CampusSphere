// backend/controllers/announcementController.js

const Announcement = require("../models/announcement");

// 📝 CREATE ANNOUNCEMENT (ADMIN ONLY)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create announcements",
      });
    }

    const announcement = await Announcement.create({
      title,
      content,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Announcement created",
      announcement,
    });
  } catch (error) {
    console.error("Create Announcement Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 📋 GET ALL ACTIVE ANNOUNCEMENTS
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    console.error("Get Announcements Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🔄 TOGGLE ACTIVE / INACTIVE (ADMIN ONLY)
exports.toggleAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update announcements",
      });
    }

    announcement.isActive = !announcement.isActive;

    await announcement.save();

    res.status(200).json({
      success: true,
      message: "Announcement status updated",
      announcement,
    });
  } catch (error) {
    console.error("Toggle Announcement Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
