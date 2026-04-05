// backend/controllers/bookingController.js

const Booking = require("../models/Booking");


// 🧠 Helper: check time overlap
const isTimeConflict = (startA, endA, startB, endB) => {
  return startA < endB && startB < endA;
};



// 📝 CREATE BOOKING
exports.createBooking = async (req, res) => {
  try {
    const { facility, date, startTime, endTime, purpose } = req.body;

    if (!facility || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Facility, date, startTime and endTime are required",
      });
    }

    // Get existing bookings for same facility + date
    const existingBookings = await Booking.find({
      facility,
      date: new Date(date),
    });

    // Check conflicts
    for (let booking of existingBookings) {
      if (
        isTimeConflict(
          startTime,
          endTime,
          booking.startTime,
          booking.endTime
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Time slot already booked",
        });
      }
    }

    // Create booking
    const newBooking = await Booking.create({
      facility,
      date,
      startTime,
      endTime,
      purpose,
      bookedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });

  } catch (error) {
    console.error("Create Booking Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// 📋 GET BOOKINGS
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bookedBy", "name email")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    console.error("Get Bookings Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};