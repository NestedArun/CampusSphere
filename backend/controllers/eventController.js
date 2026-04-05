// backend/controllers/eventController.js

const Event = require("../models/Event");


// 📝 CREATE EVENT (ADMIN ONLY)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    if (!title || !description || !location || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Only admin can create
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create events",
      });
    }

    const event = await Event.create({
      title,
      description,
      location,
      date,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    console.error("Create Event Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// 📋 GET ALL EVENTS
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .populate("attendees", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });

  } catch (error) {
    console.error("Get Events Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// 🙋 REGISTER FOR EVENT
exports.registerForEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Prevent duplicate registration
    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    event.attendees.push(req.user._id);

    await event.save();

    res.status(200).json({
      success: true,
      message: "Registered successfully",
      event,
    });

  } catch (error) {
    console.error("Register Event Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};