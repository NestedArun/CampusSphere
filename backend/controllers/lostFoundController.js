
const LostItem = require("../models/LostItem");


// 📝 CREATE LOST/FOUND ITEM
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, location, type } = req.body;

    // Validate input
    if (!title || !description || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, description, location and type are required",
      });
    }

    // Validate type
    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be either 'lost' or 'found'",
      });
    }

    // Create item
    const item = await LostItem.create({
      title,
      description,
      category,
      location,
      type,
      image: req.file ? req.file.path : "", // for later (multer)
      reportedBy: req.user._id, // from JWT middleware
    });

    res.status(201).json({
      success: true,
      message: "Item reported successfully",
      item,
    });

  } catch (error) {
    console.error("Create Item Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// 📋 GET ALL ITEMS
exports.getAllItems = async (req, res) => {
  try {
    const items = await LostItem.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });

  } catch (error) {
    console.error("Get Items Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};