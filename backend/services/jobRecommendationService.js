const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getJobRecommendations = async (userData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an AI Career Consultant. Based on the user data below, recommend 3-4 specific job roles that are currently relevant in the tech market.

      USER PROFILE:
      - Name: ${userData.name}
      - Target Role: ${userData.targetRole}
      - Current Skills: ${userData.analysis?.skills?.join(", ") || "None"}
      - Missing Skills: ${userData.analysis?.missingSkills?.join(", ") || "None"}
      - User Level: ${userData.performance?.level || "Beginner"}
      - Dashboard Progress: ${userData.performance?.progress || 0}%

      STRICT RULES:
      1. Recommendation must align with the User Level:
         - Beginner: Internships / Entry-level roles.
         - Intermediate: Junior / Associate Developer roles.
         - Advanced: Mid-Senior / Specialized roles.
      2. Provide a matchScore (0-100) based on skill overlap.
      3. Provide highly relevant skillsRequired list.
      4. Provide a clear 'reason' for the recommendation.

      OUTPUT FORMAT (STRICT JSON ONLY - NO CONVERSATION):
      {
        "recommendedJobs": [
          {
            "title": "string",
            "company": "string",
            "level": "string",
            "matchScore": number,
            "skillsRequired": ["string"],
            "reason": "string"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    try {
      // Find JSON boundaries
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON object found in AI response");
      }

      const jsonString = text.substring(firstBrace, lastBrace + 1);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse Job JSON:", text);
      return { recommendedJobs: [] };
    }
  } catch (error) {
    console.error("Job Recommendation Service Error:", error);
    throw error;
  }
};

module.exports = { getJobRecommendations };
