const Complaint = require("../models/Complaint");
const notifService = require("../services/notificationService");
const eventBus = require("../utils/eventEmitter");
const logger = require("../utils/logger");

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    if (!title || !description || !location)
      return res.status(400).json({ success: false, message: "Title, description and location are required." });

    const complaint = await Complaint.create({ title, description, category, location, createdBy: req.user._id });

    eventBus.emit(eventBus.EVENTS.COMPLAINT_CREATED, { complaint, user: req.user });

    res.status(201).json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const filter = {};
    // Students only see their own complaints
    if (req.user.role === "student") filter.createdBy = req.user._id;

    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: complaints.length, complaints });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "in-progress", "resolved"];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status." });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found." });

    complaint.status = status;
    if (status === "in-progress") complaint.assignedTo = req.user._id;
    await complaint.save();

    // Notify the complaint owner
    const statusMessages = {
      "in-progress": "Your complaint is being reviewed.",
      "resolved": "Your complaint has been resolved.",
    };
    if (statusMessages[status]) {
      await notifService.createNotification({
        recipient: complaint.createdBy,
        type: "complaint",
        title: `Complaint ${status === "resolved" ? "Resolved" : "In Progress"}`,
        message: `"${complaint.title}" — ${statusMessages[status]}`,
        link: "/complaints",
        meta: { complaintId: complaint._id },
      });
    }

    eventBus.emit(eventBus.EVENTS.COMPLAINT_UPDATED, { complaint, updatedBy: req.user });
    res.json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
