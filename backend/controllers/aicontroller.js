const { runAiAnalysis } = require("../utils/aiService");

const analyzeWithAI = async (req, res) => {
  try {
    const { text, role } = req.body;

    // ✅ Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "No resume text provided for analysis.",
      });
    }

    if (!role || role.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Target job role is required.",
      });
    }

    // ✅ AI Analysis
    const aiData = await runAiAnalysis(text, role);

    return res.status(200).json({
      success: true,
      ...aiData,
    });

  } catch (error) {
    console.error("AI_CONTROLLER_ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "AI Career Analysis failed. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { analyzeWithAI };