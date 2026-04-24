const User = require("../models/userModel");
const { getJobRecommendations } = require("../services/jobRecommendationService");

// GET JOB RECOMMENDATIONS
const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.resumeUploaded || !user.profileCompleted) {
        return res.status(400).json({ 
            message: "Please complete your profile and upload your resume first to get job recommendations.",
            jobs: []
        });
    }

    const recommendations = await getJobRecommendations(user);
    res.json(recommendations);
  } catch (error) {
    console.error("Get Jobs Controller Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedJobs };
