const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("CampusSphere API is running...");
});

// Auth routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/lost-found", require("./routes/lostFoundRoutes"));
app.use("/api/v1/complaints", require("./routes/complaintRoutes"));
app.use("/api/v1/events", require("./routes/eventRoutes"));
app.use("/api/v1/announcements", require("./routes/announcementRoutes"));

// TEMP protected route
const { protect } = require("./middleware/authMiddleware");

app.get("/api/v1/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route",
    user: req.user,
  });
});

app.use("/api/v1/events", (req, res) => {
  res.send("Events working");
});

module.exports = app; // ✅ THIS MUST EXIST