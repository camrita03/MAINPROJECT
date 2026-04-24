"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ShieldCheck, AlertTriangle, BookOpen, ChevronLeft, ArrowRight, Briefcase, PlayCircle } from "lucide-react";

import { Navbar } from "../../../components/Navbar";
import { Background } from "../../../components/Background";
import ResultCard from "../../../components/analysis/ResultCard";
import SkillTag from "../../../components/analysis/SkillTag";
import Roadmap from "../../../components/analysis/Roadmap";
import Loader from "../../../components/analysis/Loader";
import ProtectedRoute from "../../../components/auth/ProtectedRoute";

const ResultPage = () => {
  const router = useRouter();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("analysisResult");
    if (!data) {
      router.replace("/analysis");
      return;
    }

    try {
      setAnalysisData(JSON.parse(data));
      setLoading(false);
    } catch (err) {
      console.error("Error parsing analysis data", err);
      router.replace("/analysis");
    }
  }, [router]);

  const handleReset = () => {
    localStorage.removeItem("analysisResult");
    router.push("/analysis");
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-40 pb-32 px-6">
        <Background />
        <Navbar />
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-40 pb-32 px-6">
      <Background />
      <Navbar />

      <div className="max-w-[1300px] mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <button
              onClick={handleReset}
              className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Analyze Another Resume
            </button>
            
            <div className="text-center md:text-right">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Analysis Results
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                Target Role: <span className="font-semibold text-black">{analysisData.role}</span>
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-10">
               <motion.div 
                 whileHover={{ scale: 1.02 }}
                 className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50 text-center space-y-4"
               >
                 <div className="relative inline-flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * analysisData.matchScore) / 100}
                        className="text-black transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">{analysisData.matchScore}%</span>
                 </div>
                 <h3 className="text-xl font-bold">Match Score</h3>
                 <p className="text-sm text-gray-500">Based on your skills and the required role keywords.</p>
               </motion.div>

               <ResultCard title="AI Career Advice" icon={<Target className="text-blue-500" />}>
                 <p className="text-gray-600 leading-relaxed italic">
                   "{analysisData.advice}"
                 </p>
               </ResultCard>

               <ResultCard title="Recommended Videos" icon={<PlayCircle className="text-red-500" />}>
                 <div className="space-y-4">
                   {(analysisData.learningResources || analysisData.courses)?.map((item, i) => {
                     const isResource = item.url && item.title;
                     const title = isResource ? item.title : (typeof item === "string" ? item : item.title);
                     const url = isResource ? item.url : (item.link || "#");
                     
                     return (
                       <div key={i} className="group">
                         <a
                           href={url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex flex-col p-3 rounded-2xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                         >
                           <div className="flex items-center gap-3 mb-1">
                             <div className="p-1.5 bg-red-100 text-red-600 rounded-lg group-hover:scale-110 transition-transform">
                               <PlayCircle className="w-4 h-4" />
                             </div>
                             <span className="text-gray-800 font-bold text-sm line-clamp-1 group-hover:text-red-600">
                               {title}
                             </span>
                           </div>
                           {item.channel && (
                             <span className="text-[10px] text-gray-400 font-medium ml-10">
                               by {item.channel}
                             </span>
                           )}
                         </a>
                       </div>
                     );
                   })}
                   {(!analysisData.learningResources && !analysisData.courses) && (
                     <p className="text-gray-400 text-xs italic px-2">No recommendations generated.</p>
                   )}
                 </div>
               </ResultCard>
            </div>

            <div className="lg:col-span-2 space-y-10">
              <div className="grid md:grid-cols-2 gap-6">
                <ResultCard title="Skills Found" icon={<ShieldCheck className="text-green-500" />} delay={0.1}>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.skills?.map((s) => (
                      <SkillTag key={s} skill={s} type="positive" />
                    ))}
                  </div>
                </ResultCard>

                <ResultCard title="Missing Skills" icon={<AlertTriangle className="text-amber-500" />} delay={0.2}>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.missingSkills?.map((s) => (
                      <SkillTag key={s} skill={s} type="negative" />
                    ))}
                  </div>
                </ResultCard>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Roadmap roadmap={analysisData.roadmap} />
              </motion.div>
            </div>
          </div>

          <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4 pb-10">
            <button
               onClick={() => router.push("/learning-recommendations")}
               className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              View Learning Roadmap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
               onClick={() => router.push("/job-recommendation")}
               className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-slate-800 to-black text-white rounded-2xl font-bold shadow-lg shadow-black/20 hover:shadow-black/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Briefcase className="w-5 h-5" />
              Job Recommendations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
               onClick={handleReset}
               className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all"
            >
               Start New Analysis
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  );

};

export default ResultPage;
