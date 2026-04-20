"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  RefreshCcw,
  Sparkles,
  Award,
  ArrowRight,
  FileDown,
  Image as ImageIcon,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";
import UploadBox from "@/components/analysis/UploadBox";
import Loader from "@/components/analysis/Loader";
import ResultCard from "@/components/analysis/ResultCard";
import SkillTag from "@/components/analysis/SkillTag";
import Roadmap from "@/components/analysis/Roadmap";

const ROLE_SKILLS_MAP: Record<string, string[]> = {
  "frontend developer": ["HTML", "CSS", "JavaScript", "React", "Next.js"],
  "backend developer": ["Node.js", "Express", "MongoDB", "API Design", "SQL"],
  "full stack developer": ["React", "Node.js", "MongoDB", "System Design", "Express", "SQL"],
  "data analyst": ["Python", "SQL", "Excel", "Power BI", "Statistics", "Pandas"],
  "linux administrator": ["Linux", "Shell Scripting", "Networking", "Docker", "AWS", "Bash"],
};

const AnalysisPage = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "completed">("idle");
  const [analysisData, setAnalysisData] = useState<any>(null);

  // 🚀 REAL BACKEND INTEGRATION
  const handleAnalyze = async (file: File, roleInput: string) => {
    if (!roleInput.trim()) {
      alert("Please enter your desired job role first.");
      return;
    }

    try {
      setStatus("loading");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", roleInput);

      const res = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend response:", data);

      const skills = data.skills || [];

      const requiredSkills =
        ROLE_SKILLS_MAP[roleInput.toLowerCase().trim()] || [];

      const matchingSkills = requiredSkills.filter((skill) =>
        skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())
      );

      const missingSkills = requiredSkills.filter(
        (skill) =>
          !skills.some((s: string) => s.toLowerCase() === skill.toLowerCase())
      );

      const matchScore = Math.round(
        (matchingSkills.length / (requiredSkills.length || 1)) * 100
      );

      setAnalysisData({
        matchScore,
        targetRole: roleInput,
        suggestedRole: roleInput,
        skillsHave: skills,
        skillsMissing: {
          mustHave: missingSkills.slice(0, Math.ceil(missingSkills.length / 2)),
          goodToHave: missingSkills.slice(Math.ceil(missingSkills.length / 2)),
        },
        gapAnalysis:
          missingSkills.length > 0
            ? `You need to improve ${missingSkills.join(", ")} to become a strong ${roleInput}.`
            : `Excellent match for ${roleInput}. Focus on advanced topics.`,
        roadmap:
          missingSkills.length > 0
            ? missingSkills.map((s, i) => ({
                step: i + 1,
                title: `Master ${s}`,
              }))
            : [
                { step: 1, title: "Build advanced projects" },
                { step: 2, title: "Contribute to open source" },
                { step: 3, title: "Prepare for interviews" },
              ],
        insights: `Focus on ${
          missingSkills[0] || "advanced skills"
        } to stay ahead of competition.`,
      });

      setStatus("completed");
    } catch (err) {
      console.error(err);
      alert("Error analyzing resume");
      setStatus("idle");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setAnalysisData(null);
  };

  return (
    <main className="min-h-screen pt-40 pb-32 px-6">
      <Background />
      <Navbar />

      <div className="max-w-[1300px] mx-auto">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div key="upload" className="text-center space-y-12">
              <h1 className="text-5xl font-bold">
                Resume Analyzer 🚀
              </h1>
              <UploadBox onAnalyze={handleAnalyze} isLoading={false} />
            </motion.div>
          )}

          {status === "loading" && (
            <div className="flex justify-center min-h-[50vh]">
              <Loader />
            </div>
          )}

          {status === "completed" && analysisData && (
            <div className="space-y-10">
              {/* Score */}
              <div className="text-center">
                <h2 className="text-4xl font-bold">
                  Match Score: {analysisData.matchScore}%
                </h2>
                <p className="text-gray-500">
                  Target Role: {analysisData.targetRole}
                </p>
              </div>

              {/* Skills */}
              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard title="Skills You Have" icon={<ShieldCheck />}>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.skillsHave.map((s: string) => (
                      <SkillTag key={s} skill={s} type="positive" />
                    ))}
                  </div>
                </ResultCard>

                <ResultCard title="Missing Skills" icon={<AlertTriangle />}>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.skillsMissing.mustHave.map((s: string) => (
                      <SkillTag key={s} skill={s} type="negative" />
                    ))}
                  </div>
                </ResultCard>
              </div>

              {/* Analysis */}
              <ResultCard title="Gap Analysis" icon={<Target />}>
                <p>{analysisData.gapAnalysis}</p>
              </ResultCard>

              {/* Roadmap */}
              <Roadmap roadmap={analysisData.roadmap} />

              {/* Reset */}
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-black text-white rounded-xl"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default AnalysisPage;