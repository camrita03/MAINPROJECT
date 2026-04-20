const extractText = require("../utils/resumeParser");
const extractSkills = require("../utils/skillExtractor");

const analyzeResume = async (req, res) => {
  try {
    const filePath = req.file.path;

    const text = await extractText(filePath);

    const skills = extractSkills(text);

    res.json({
      extractedText: text.substring(0, 500), // preview
      skills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error analyzing resume" });
  }
};

module.exports = { analyzeResume };