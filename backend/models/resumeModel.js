const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileName: String,
    role: String,
    extractedText: String,
    skills: [String],
    missingSkills: [String],
    matchScore: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);