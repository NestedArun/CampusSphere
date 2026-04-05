// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");


// 🔐 VERIFY TOKEN
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. If no token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 5. Attach user to request
    req.user = user;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

// 🔒 ROLE CHECK
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role (${req.user.role}) not allowed`,
      });
    }

    next();
  };
};