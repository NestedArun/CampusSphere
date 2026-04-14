const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Note = require("../models/Note");
const { notesQueue } = require("../queues");
const { protect, authorize } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      ".pdf",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
      ".xlsx",
      ".txt",
      ".png",
      ".jpg",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext)
      ? cb(null, true)
      : cb(new Error("File type not allowed"));
  },
});

router.post(
  "/",
  protect,
  authorize("admin", "teacher"),
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      const { title, subject, type } = req.body;

      // Create a DB placeholder in 'processing' state so the frontend can show the item immediately
      const note = await Note.create({
        title,
        subject,
        type,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        uploadedBy: req.user._id,
        status: "processing",
      });

      // Enqueue job to finish processing (worker will mark it ready)
      try {
        await notesQueue.add("processNote", {
          noteId: note._id.toString(),
          filePath: req.file.path,
        });
      } catch (queueErr) {
        // If enqueuing fails, mark note as failed
        note.status = "failed";
        await note.save();
        console.error("Queue error:", queueErr.message || queueErr);
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to enqueue processing job",
          });
      }

      // Return accepted with the created note placeholder
      res.status(202).json({ success: true, note, queued: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

router.get("/", protect, async (req, res) => {
  try {
    const { subject, type, search } = req.query;
    const filter = {};
    if (subject) filter.subject = subject;
    if (type) filter.type = type;
    if (search) filter.title = { $regex: search, $options: "i" };
    const notes = await Note.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/:id/download", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note)
      return res.status(404).json({ success: false, message: "Not found" });
    const filePath = path.join(__dirname, "../uploads", note.filename);
    if (!fs.existsSync(filePath))
      return res
        .status(404)
        .json({ success: false, message: "File missing on server" });
    res.download(filePath, note.originalName);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete(
  "/:id",
  protect,
  authorize("admin", "teacher"),
  async (req, res) => {
    try {
      const note = await Note.findById(req.params.id);
      if (!note)
        return res.status(404).json({ success: false, message: "Not found" });
      const filePath = path.join(__dirname, "../uploads", note.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await note.deleteOne();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
);

module.exports = router;
