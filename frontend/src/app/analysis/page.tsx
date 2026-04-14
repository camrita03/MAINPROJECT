"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  BrainCircuit, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCcw,
  Sparkles,
  Award,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Background } from '@/components/Background';
import UploadBox from '@/components/analysis/UploadBox';
import Loader from '@/components/analysis/Loader';
import ResultCard from '@/components/analysis/ResultCard';
import SkillTag from '@/components/analysis/SkillTag';
import Roadmap from '@/components/analysis/Roadmap';
import { Download, FileDown, Image as ImageIcon } from 'lucide-react';

const ROLE_SKILLS_MAP: Record<string, string[]> = {
  "frontend developer": ["HTML", "CSS", "JavaScript", "React", "Next.js"],
  "backend developer": ["Node.js", "Express", "MongoDB", "API Design", "SQL"],
  "full stack developer": ["React", "Node.js", "MongoDB", "System Design", "Express", "SQL"],
  "data analyst": ["Python", "SQL", "Excel", "Power BI", "Statistics", "Pandas"],
  "linux administrator": ["Linux", "Shell Scripting", "Networking", "Docker", "AWS", "Bash"]
};

const DUMMY_PROFILES = [
  ["HTML", "CSS", "JavaScript", "React", "Git", "Figma"],
  ["Python", "SQL", "Excel", "Data Cleaning", "Matplotlib", "Git"],
  ["Node.js", "Express", "JavaScript", "API Design", "SQL", "Docker"],
  ["Linux", "Networking", "Security", "Bash", "Shell Scripting"]
];

const AnalysisPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'completed'>('idle');
  const [analysisData, setAnalysisData] = useState<any>(null);

  const handleAnalyze = (file: File, roleInput: string) => {
    // 1. Normalize Input
    const normalizedRole = roleInput.toLowerCase().trim();
    
    // 2. Fetch Required Skills
    const requiredSkills = ROLE_SKILLS_MAP[normalizedRole];
    
    // 3. Debug Check
    console.log("Analyzing Role:", normalizedRole);
    console.log("Required Skills:", requiredSkills);

    if (!roleInput.trim()) {
      alert("Please enter your desired job role first.");
      return;
    }

    setStatus('loading');
    
    setTimeout(() => {
      // 4. Simulate Resume Parsing (Keyword-based Dummy Data)
      const fileNameLower = file.name.toLowerCase();
      let userSkills: string[] = [];
      
      if (fileNameLower.includes("linux") || fileNameLower.includes("admin") || fileNameLower.includes("devops")) {
        userSkills = DUMMY_PROFILES[3];
      } else if (fileNameLower.includes("data") || fileNameLower.includes("analyst")) {
        userSkills = DUMMY_PROFILES[1];
      } else if (fileNameLower.includes("backend")) {
        userSkills = DUMMY_PROFILES[2];
      } else {
        userSkills = DUMMY_PROFILES[0];
      }

      // 5. Skill Matching Logic
      let matchingSkills: string[] = [];
      let missingSkills: string[] = [];
      let isFallback = false;

      if (requiredSkills) {
        matchingSkills = requiredSkills.filter(skill => 
          userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
        );
        missingSkills = requiredSkills.filter(skill => 
          !userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
        );
      } else {
        // Fallback for unrecognized roles
        isFallback = true;
        matchingSkills = userSkills.slice(0, 3);
        missingSkills = ["Technical Depth", "Domain Expertise", "System Architecture"];
      }

      const totalRequired = requiredSkills ? requiredSkills.length : 5;
      const matchScore = Math.round((matchingSkills.length / totalRequired) * 100);

      // 6. Role-Aware Analysis Text
      let gapAnalysis = "";
      if (isFallback) {
        gapAnalysis = `Role not recognized, showing general analysis for "${roleInput}". You have strong foundations in ${userSkills.slice(0, 2).join(" and ")}, but need to specialize further for this specific path.`;
      } else {
        if (matchScore < 40) {
          gapAnalysis = `Your current profile is significantly misaligned for a ${roleInput}. To succeed in this role, you must urgently bridge the gap in ${missingSkills.slice(0, 2).join(" and ")}.`;
        } else if (matchScore < 75) {
          gapAnalysis = `You have a workable base for ${roleInput}, but you lack critical proficiency in ${missingSkills[0] || "niche technologies"}. Strengthening your ${missingSkills.slice(0, 2).join("/")} expertise is the next priority.`;
        } else {
          gapAnalysis = `Excellent fit for ${roleInput}. You already master the core ${matchingSkills.slice(0, 2).join("/")} requirements. Focus now on ${missingSkills.length > 0 ? missingSkills[0] : "advanced leadership"} to stand out.`;
        }
      }

      // 7. Role-Specific Roadmap
      const roadmapSteps = missingSkills.length > 0 
        ? missingSkills.map((s, i) => ({ step: i + 1, title: `Master ${s} Fundamentals` }))
        : [
            { step: 1, title: "Polish portfolio with real-world case studies" },
            { step: 2, title: "Obtain specialized industry certifications" },
            { step: 3, title: "Prepare for senior-level technical interviews" }
          ];

      setAnalysisData({
        matchScore,
        targetRole: roleInput, // Use EXACT user input
        suggestedRole: isFallback ? "General Professional" : roleInput,
        skillsHave: userSkills,
        skillsMissing: {
          mustHave: missingSkills.slice(0, Math.ceil(missingSkills.length / 2)),
          goodToHave: missingSkills.slice(Math.ceil(missingSkills.length / 2))
        },
        gapAnalysis,
        roadmap: roadmapSteps.slice(0, 5), // Cap steps
        insights: isFallback 
          ? "We've applied a multi-domain scanning algorithm to your profile as the role entered is outside our standard database."
          : `Current industry trends for ${roleInput} positions emphasize the importance of ${matchingSkills[0] || "core skills"}. Master the roadmap to stay ahead of 90% of candidates.`
      });
      setStatus('completed');
    }, 3000);
  };

  const handleReset = () => {
    setStatus('idle');
    setAnalysisData(null);
  };

  return (
    <main className="min-h-screen pt-40 pb-32 px-6">
      <Background />
      <Navbar />

      {/* Background Decorative Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[10%] -right-[5%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[150px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-[1300px] mx-auto">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-20 text-center"
            >
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/40 backdrop-blur-md text-blue-600 font-black text-xs border border-white/60 shadow-xl shadow-blue-500/5 mb-4 uppercase tracking-[0.2em]"
                >
                  <Sparkles className="w-4 h-4" />
                  Cognitive Scan v4.0
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-[-0.04em] leading-[0.9]">
                  Architect Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-shimmer">Future.</span>
                </h1>
                <p className="text-slate-500 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed opacity-80">
                  Transcend standard recruitment. Deploy our proprietary neural engine <br className="hidden md:block" />
                   to decode your career DNA and unlock tier-1 opportunities.
                </p>
              </div>

              <UploadBox onAnalyze={handleAnalyze} isLoading={false} />
            </motion.div>
          )}

          {status === 'loading' && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[50vh]"
            >
              <Loader />
            </motion.div>
          )}

          {status === 'completed' && analysisData && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              {/* Header section with summary */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/60 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="relative group p-2 bg-white/50 rounded-full shadow-inner border border-white">
                    <svg className="w-40 h-40 transform -rotate-90 drop-shadow-2xl">
                      <circle
                        cx="80"
                        cy="80"
                        r="72"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-blue-50/50"
                      />
                      <motion.circle
                        cx="80"
                        cy="80"
                        r="72"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={452.39}
                        initial={{ strokeDashoffset: 452.39 }}
                        animate={{ strokeDashoffset: 452.39 - (452.39 * analysisData.matchScore) / 100 }}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                        strokeLinecap="round"
                        className="text-blue-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-slate-800 tracking-tighter">{analysisData.matchScore}%</span>
                      <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] mt-1">Match Index</span>
                    </div>
                  </div>
                  <div className="text-center md:text-left space-y-3">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">Synthesis Matrix</h2>
                    <p className="text-slate-500 font-bold text-lg flex items-center justify-center md:justify-start gap-3">
                       Target Role: <span className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-black shadow-lg shadow-blue-500/20">{analysisData.targetRole}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert("Simulation: Report downloading as PDF...")}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    <FileDown className="w-5 h-5" />
                    Download PDF
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => alert("Simulation: Results saved as image...")}
                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Save as Image
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-xl"
                  >
                    <RefreshCcw className="w-5 h-5" />
                    Reset
                  </motion.button>
                </div>
              </div>

              {/* Skill Gap Analysis - Brutally Honest */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-br from-slate-900 to-slate-800 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Target className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h3 className="text-blue-400 font-black tracking-widest uppercase text-xs">Skill Gap Analysis</h3>
                  <p className="text-3xl font-bold text-white leading-tight max-w-4xl">
                    "{analysisData.gapAnalysis}"
                  </p>
                </div>
              </motion.div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* Suggested Role */}
                <ResultCard 
                  title="Target Role" 
                  icon={<Target className="w-6 h-6" />}
                  delay={0.1}
                >
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                      <p className="text-2xl font-black text-blue-700">{analysisData.suggestedRole}</p>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed font-medium">
                      Your profile matches closely with seniority expectations for this position in modern tech companies.
                    </p>
                    <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:gap-3 transition-all underline decoration-2 underline-offset-4">
                      Explore this roadmap <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </ResultCard>

                {/* Skills You Have */}
                <ResultCard 
                  title="Core Strengths" 
                  icon={<ShieldCheck className="w-6 h-6" />}
                  delay={0.2}
                >
                  <div className="flex flex-wrap gap-2">
                    {analysisData.skillsHave.map((skill: string) => (
                      <SkillTag key={skill} skill={skill} type="positive" />
                    ))}
                  </div>
                </ResultCard>

                 {/* Missing Skills */}
                <ResultCard 
                  title="Missing Skills" 
                  icon={<AlertTriangle className="w-6 h-6" />}
                  delay={0.3}
                  className="lg:col-span-1"
                >
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-rose-500 tracking-widest mb-3">Must-have</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.skillsMissing.mustHave.map((skill: string) => (
                          <SkillTag key={skill} skill={skill} type="negative" />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-orange-500 tracking-widest mb-3">Good-to-have</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.skillsMissing.goodToHave.map((skill: string) => (
                          <SkillTag key={skill} skill={skill} type="warning" />
                        ))}
                      </div>
                    </div>
                  </div>
                </ResultCard>

                {/* AI Insights - Large Card */}
                <ResultCard 
                  title="AI Career Insights" 
                  icon={<BrainCircuit className="w-6 h-6" />}
                  className="lg:col-span-2"
                  delay={0.4}
                >
                  <div className="space-y-4 relative">
                    <div className="absolute -top-10 -right-4 opacity-5">
                      <Sparkles className="w-32 h-32" />
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed font-serif italic">
                      "{analysisData.insights}"
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                      <div className="flex -space-x-2">
                         {[1,2,3].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-100" />
                         ))}
                      </div>
                      <p className="text-xs text-slate-500 font-bold">Trusted by 2,000+ HR Specialists</p>
                    </div>
                  </div>
                </ResultCard>

                 {/* Achievements Box */}
                <ResultCard 
                  title="Market Value" 
                  icon={<Award className="w-6 h-6" />}
                  delay={0.5}
                >
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-bold text-sm">Percentile</span>
                        <span className="text-emerald-600 font-black">Top 28%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "72%" }}
                          transition={{ duration: 1, delay: 1 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                     </div>
                     <p className="text-xs text-slate-400 leading-tight">Your compatibility is measured against 15,000+ benchmarked profiles in the industry.</p>
                  </div>
                </ResultCard>
              </div>

              {/* Roadmap Section */}
              <Roadmap roadmap={analysisData.roadmap} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 w-full h-[30vh] pointer-events-none bg-gradient-to-t from-blue-50/50 to-transparent -z-10" />
    </main>
  );
};

export default AnalysisPage;
