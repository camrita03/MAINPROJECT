const User = require("../models/userModel");

/**
 * Helper to calculate level based on progress
 */
const calculateLevel = (progress) => {
  if (progress < 30) return "Beginner";
  if (progress < 70) return "Intermediate";
  return "Advanced";
};

// GET PERFORMANCE STATS
const getPerformance = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      performance: user.performance,
      trackingMode: user.trackingMode,
      roadmapLength: user.analysis?.roadmap?.length || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STEP COMPLETION
const updateStepValue = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { stepIndex } = req.body;
    
    // Initialize performance if needed
    if (!user.performance) {
      user.performance = { completedSteps: [], progress: 0, level: "Beginner" };
    }

    const completedSteps = [...(user.performance.completedSteps || [])];
    const isAlreadyCompleted = completedSteps.includes(stepIndex);

    // Toggle step
    let newSteps;
    if (isAlreadyCompleted) {
      newSteps = completedSteps.filter(i => i !== stepIndex);
    } else {
      // Validate sequence if in auto mode
      if (user.trackingMode === "auto" && stepIndex > 0 && !completedSteps.includes(stepIndex - 1)) {
        return res.status(400).json({ message: "Please complete previous steps first (Auto Mode)" });
      }
      newSteps = [...completedSteps, stepIndex];
    }

    const totalSteps = user.analysis?.roadmap?.length || 1;
    const progress = Math.round((newSteps.length / totalSteps) * 100);
    const level = calculateLevel(progress);

    // Streak logic - increment if active on a new day, reset if more than 1 day gap
    const now = new Date();
    const lastDate = new Date(user.performance.lastUpdated);
    const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        user.performance.streak = (user.performance.streak || 0) + 1;
    } else if (diffDays > 1) {
        user.performance.streak = 1; // Reset to 1 for today's activity
    } else if (!user.performance.streak) {
        user.performance.streak = 1; // First time activity
    }

    user.performance.completedSteps = newSteps;
    user.performance.progress = progress;
    user.performance.level = level;
    user.performance.totalSteps = totalSteps;
    user.performance.lastUpdated = now;

    await user.save();
    res.json({ message: "Performance updated", performance: user.performance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SWITCH TRACKING MODE
const switchTrackingMode = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { mode } = req.body;
    if (mode && ["auto", "manual"].includes(mode)) {
      user.trackingMode = mode;
    }

    await user.save();
    res.json({ message: "Tracking mode updated", trackingMode: user.trackingMode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPerformance,
  updateStepValue,
  switchTrackingMode
};
