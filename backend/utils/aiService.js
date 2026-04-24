const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const runAiAnalysis = async (text, role) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables");
    }
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash", 
    });

    const prompt = `
You are an AI career mentor. Analyze the following resume for the target role: ${role}

CRITICAL: Return ONLY a valid JSON object. No conversational text.

STRUCTURE:
{
  "skills": ["list of current skills"],
  "missingSkills": ["list of missing skills"],
  "matchScore": number (0-100),
  "advice": "short professional advice",
  "roadmap": ["step 1", "step 2", "step 3"],
  "learningResources": [
    {
      "skill": "Specific Skill Name",
      "type": "video",
      "title": "Exact YouTube Video Title",
      "url": "https://www.youtube.com/watch?v=VIDEO_ID",
      "channel": "Channel Name",
      "duration": "approx duration",
      "level": "Beginner/Intermediate/Advanced",
      "reason": "Why this video is perfect for this missing skill"
    }
  ]
}

SPECIFIC RULES for learningResources:
1. Provide 3-5 HIGHLY RELEVANT YouTube videos focusing on the "missingSkills".
2. DO NOT return YouTube channels. ONLY return specific video links.
3. Videos MUST be recent (2023-2025).
4. Match the skill to the role (e.g., if role is Frontend, recommend React/Next.js videos).
5. Ensure the "url" is a direct video link, not a playlist or channel.
6. Use well-known educators like Web Dev Simplified, Dave Gray, Fireship, Programming with Mosh, or Codevolution.

Resume Content:
${text}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let output = response.text();

    console.log("🤖 AI RAW OUTPUT:", output);

    try {
      // Find the first { and last }
      const firstBrace = output.indexOf("{");
      const lastBrace = output.lastIndexOf("}");
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found in AI response");
      }

      const jsonString = output.substring(firstBrace, lastBrace + 1);
      const parsed = JSON.parse(jsonString);

      // ✅ Validation & Fallback for learningResources
      if (!parsed.learningResources || !Array.isArray(parsed.learningResources)) {
        parsed.learningResources = [];
      }

      // Ensure each resource has required fields
      parsed.learningResources = parsed.learningResources.map(res => ({
        skill: res.skill || "General",
        type: res.type || "video",
        title: res.title || "Recommended Tutorial",
        url: res.url || "https://www.youtube.com/",
        channel: res.channel || "Unknown",
        duration: res.duration || "N/A",
        level: res.level || "Beginner",
        reason: res.reason || "Matched with your skill gap."
      })).filter(res => res.url.includes("youtube.com/watch?v="));

      return parsed;

    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", err.message);
      
      // Return a basic fallback structure if AI fails
      return {
        skills: [],
        missingSkills: [],
        matchScore: 0,
        advice: "We encountered an error analyzing your resume. Please try again with a clearer file.",
        roadmap: [],
        learningResources: []
      };
    }

  } catch (error) {
    console.error("AI_SERVICE_ERROR:", error);
    throw error;
  }
};

module.exports = { runAiAnalysis };