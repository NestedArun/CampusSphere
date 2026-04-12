const Booking      = require("../models/Booking");
const notifService = require("../services/notificationService");

exports.createBooking = async (req, res) => {
  try {
    const { venue, date, startTime, endTime, purpose } = req.body;
    if (!venue || !date)
      return res.status(400).json({ success: false, message: "Venue and date required." });

    const booking = await Booking.create({ venue, date, startTime, endTime, purpose, bookedBy: req.user._id });

    await notifService.createNotification({
      recipient: req.user._id,
      type:      "booking",
      title:     "✅ Booking Confirmed",
      message:   `${venue} booked for ${new Date(date).toLocaleDateString("en-IN")}${startTime ? ` at ${startTime}` : ""}.`,
      link:      "/booking",
      meta:      { bookingId: booking._id },
    });

    res.status(201).json({ success: true, booking });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getBookings = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { bookedBy: req.user._id } : {};
    const bookings = await Booking.find(filter)
      .populate("bookedBy","name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Not found." });

    await notifService.createNotification({
      recipient: booking.bookedBy,
      type:      "booking",
      title:     "❌ Booking Cancelled",
      message:   `Your booking for ${booking.venue} has been cancelled.`,
      link:      "/booking",
    });

    await booking.deleteOne();
    res.json({ success: true });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
