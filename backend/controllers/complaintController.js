// backend/controllers/complaintController.js

const Complaint = require("../models/Complaint");


// 📝 CREATE COMPLAINT
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description and location are required",
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Complaint created successfully",
      complaint,
    });

  } catch (error) {
    console.error("Create Complaint Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// 📋 GET ALL COMPLAINTS
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });

  } catch (error) {
    console.error("Get Complaints Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// 🔄 UPDATE STATUS (ADMIN ONLY)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // Only admin can update
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can update complaint status",
      });
    }

    // Validate status
    const allowedStatus = ["pending", "in-progress", "resolved"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    complaint.status = status;

    // Optional: assign admin automatically when in-progress
    if (status === "in-progress") {
      complaint.assignedTo = req.user._id;
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated",
      complaint,
    });

  } catch (error) {
    console.error("Update Complaint Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};