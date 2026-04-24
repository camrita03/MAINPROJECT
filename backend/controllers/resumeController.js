let pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Resume = require("../models/resumeModel");
const User = require("../models/userModel");
const { runAiAnalysis } = require("../utils/aiService");

// 📤 Upload + AI Analyze Resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let text = "";

    // 📄 PDF Extraction
    if (req.file.mimetype === "application/pdf") {
      const parser =
        typeof pdfParse === "function" ? pdfParse : pdfParse.default;
      if (typeof parser !== "function") {
        throw new Error("pdf-parse library not loaded correctly");
      }
      const data = await parser(req.file.buffer);
      text = data.text;
    }
    // 📄 DOCX Extraction
    else if (
      req.file.mimetype.includes("word") ||
      req.file.mimetype.includes("officedocument")
    ) {
      const data = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });
      text = data.value;
    } else {
      throw new Error("Unsupported file type. Please upload PDF or DOCX.");
    }

    if (!text || text.trim().length === 0) {
      throw new Error("Could not extract text from the file.");
    }

    // 🚀 CALL AI SERVICE DIRECTLY
    const aiData = await runAiAnalysis(text, req.body.role);

    // 💾 Save in Resume Collection
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      role: req.body.role,
      extractedText: text,
      skills: aiData.skills,
      missingSkills: aiData.missingSkills,
      matchScore: aiData.matchScore,
    });

    // 💾 Update User state
    await User.findByIdAndUpdate(req.user._id, {
      resumeUploaded: true,
      analysis: {
        skills: aiData.skills,
        missingSkills: aiData.missingSkills,
        roadmap: aiData.roadmap || [],
      },
    });

    // 🚀 SEND RESULT TO FRONTEND
    res.json({
      message: "Resume analyzed successfully",
      ...aiData,
      resumeId: resume._id,
    });
  } catch (error) {
    console.error("ANALYSIS ERROR:", error);
    res.status(500).json({
      message: error.message || "Error processing resume",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

module.exports = { uploadResume };