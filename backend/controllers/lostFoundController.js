
const LostItem = require("../models/LostItem");


// 📝 CREATE LOST/FOUND ITEM
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, location, type } = req.body;

    if (!title || !description || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Title, description, location and type are required",
      });
    }

    if (!["lost", "found"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'lost' or 'found'",
      });
    }

    const item = await require("../models/LostItem").create({
      title,
      description,
      category,
      location,
      type,
      reportedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Item created successfully",
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
    console.error("Get Items Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🙋 CLAIM ITEM
exports.claimItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Prevent claiming own item
    if (item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own item",
      });
    }

    // Prevent duplicate claim
    if (item.status === "claimed") {
      return res.status(400).json({
        success: false,
        message: "Item already claimed",
      });
    }

    // Update item
    item.status = "claimed";
    item.claimedBy = req.user._id;

    await item.save();

    res.status(200).json({
      success: true,
      message: "Item claimed successfully",
      item,
    });

  } catch (error) {
    console.error("Claim Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 🔒 CLOSE ITEM
exports.closeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await LostItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Only owner or admin can close
    if (
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to close this item",
      });
    }

    item.status = "closed";
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item closed successfully",
      item,
    });

  } catch (error) {
    console.error("Close Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};