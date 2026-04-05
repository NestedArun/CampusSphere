const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("CampusSphere API is running...");
});

// Auth routes
app.use("/api/v1/auth", require("./routes/authRoutes"));

// TEMP protected route
const { protect } = require("./middleware/authMiddleware");

app.get("/api/v1/protected", protect, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected route",
    user: req.user,
  });
});

module.exports = app; // ✅ THIS MUST EXIST