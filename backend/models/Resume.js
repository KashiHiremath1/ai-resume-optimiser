const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  resume: String,
  analysis: String,
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", ResumeSchema);