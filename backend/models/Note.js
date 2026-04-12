const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  subject:      { type: String, required: true },
  type:         { type: String, enum:["notes","syllabus","reference"], default:"notes" },
  filename:     { type: String, required: true }, // stored name on disk
  originalName: { type: String, required: true }, // original upload name
  size:         { type: Number },
  uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref:"User" },
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);