const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, 
      trim: true
    },
    password: {
      type: String,
      required: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    resumeUploaded: {
      type: Boolean,
      default: false,
    },
    profileData: {
      phone: String,
      location: String,
      education: String,
      experience: String,
      interests: [String],
    },
    targetRole: String,
    performance: {
      totalSteps: { type: Number, default: 0 },
      completedSteps: { type: [Number], default: [] },
      progress: { type: Number, default: 0 },
      level: { type: String, default: "Beginner" },
      lastUpdated: { type: Date, default: Date.now },
      streak: { type: Number, default: 0 },
    },
    trackingMode: {
      type: String,
      enum: ["auto", "manual"],
      default: "manual"
    },
    analysis: {
      skills: [String],
      missingSkills: [String],
      roadmap: [Object],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

