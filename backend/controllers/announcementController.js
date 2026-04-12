const Announcement = require("../models/Announcement");
const User = require("../models/User");
const notifService = require("../services/notificationService");
const eventBus = require("../utils/eventEmitter");

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("createdBy", "name").sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: "Title and content required." });
    const announcement = await Announcement.create({ title, content, category, priority, createdBy: req.user._id });

    // Broadcast to all active users
    const allUsers = await User.find({ isActive: true }).select("_id");
    await notifService.broadcastNotification(allUsers.map(u => u._id), {
      type: "announcement",
      title: "New Announcement",
      message: title,
      link: "/announcements",
    });

    eventBus.emit(eventBus.EVENTS.ANNOUNCEMENT_CREATED, { announcement });
    res.status(201).json({ success: true, announcement });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
