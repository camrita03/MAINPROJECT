const skillsList = [
  "javascript", "python", "java", "react", "node.js", "node", "mongodb",
  "html", "css", "c++", "sql", "machine learning", "ai", "next.js",
  "express", "api design", "system design", "excel", "power bi",
  "statistics", "pandas", "linux", "shell scripting", "networking",
  "docker", "aws", "bash", "git", "typescript", "tailwind", "redux"
];

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  
  return skillsList.filter(skill => {
    // Escape special characters for regex (like c++)
    const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Using word boundaries to match exact skills (handling special cases like c++)
    const regex = new RegExp(`(\\b|\\s|^)${escapedSkill}(\\b|\\s|$)`, 'i');
    return regex.test(lowerText);
  });
};

module.exports = extractSkills;