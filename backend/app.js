// backend/app.js

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

// ✅ Auth Routes
app.use("/api/v1/auth", require("./routes/authRoutes"));

module.exports = app;