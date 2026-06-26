const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  text: String,
  summary: String,
  skills: [String],
  experience_level: String,
  score: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resume", ResumeSchema);