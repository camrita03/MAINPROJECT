"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Target, PlayCircle, BookOpen, ExternalLink, Map, GraduationCap } from "lucide-react";

import { Navbar } from "../../components/Navbar";
import { Background } from "../../components/Background";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import API from "../../utils/api";

const LearningRecommendations = () => {
  const router = useRouter();
  const [learningData, setLearningData] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedStr = localStorage.getItem("analysisResult");
    if (!storedStr) {
      router.replace("/analysis");
      return;
    }

    const fetchUser = async () => {
      try {
        const { data } = await API.get("/users/profile");
        setUserData(data);
      } catch (err) {
        console.error("User fetch failed:", err);
      }
    };

    fetchUser();

    try {
      const data = JSON.parse(storedStr);
      
      const userCareer = {
        id: "analysis-result",
        title: data.role || "Analyzed Role",
        matchScore: data.matchScore,
        skills: data.missingSkills || data.skills || [],
        learningResources: data.learningResources || [],
        roadmap: data.roadmap || []
      };

      setLearningData([userCareer]);
      setSelectedCareer(userCareer);
      setLoading(false);
    } catch (err) {
      console.error("Failed to parse analysisResult:", err);
      router.replace("/analysis");
    }
  }, [router]);

  const trackAutoProgress = async (index) => {
    if (!userData || userData.trackingMode !== "auto") return;

    const completedSteps = userData.performance?.completedSteps || [];
    if (completedSteps.includes(index)) return;

    // Check sequence: can only complete if previous ones are done OR it's the first one
    const isFirst = index === 0;
    const previousDone = completedSteps.includes(index - 1);
    
    if (!isFirst && !previousDone) {
       console.log("Auto progress: follow the sequence!");
       return;
    }

    try {
      const { data } = await API.post("/performance/update-step", { stepIndex: index });
      setUserData(prev => ({
        ...prev,
        performance: data.performance
      }));
    } catch (err) {
      console.error("Auto tracking failed:", err);
    }
  };

  // ✅ Helper to get YouTube ID
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const COURSE_DATABASE = {
    // ... same database ...
    javascript: {
      docs: { name: "MDN Web Docs: JavaScript", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      video: { name: "JavaScript Full Course", url: "https://www.youtube.com/watch?v=W6NZfCO5SIk" },
      practice: { name: "JavaScript30 Projects", url: "https://javascript30.com/" }
    },
    react: {
      docs: { name: "React Official Docs", url: "https://react.dev/" },
      video: { name: "React FreeCodeCamp Course", url: "https://www.youtube.com/watch?v=bMknfKXIFA8" },
      practice: { name: "React Tic-Tac-Toe Tutorial", url: "https://react.dev/learn/tutorial-tic-tac-toe" }
    },
    python: {
      docs: { name: "Python Official Docs", url: "https://docs.python.org/3/" },
      video: { name: "Python for Beginners", url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc" },
      practice: { name: "LeetCode Programming Skills", url: "https://leetcode.com/studyplan/programming-skills/" }
    },
    sql: {
      docs: { name: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" },
      video: { name: "SQL Full Course", url: "https://www.youtube.com/watch?v=HXV3zeJZ1EQ" },
      practice: { name: "SQLZoo Interactive Exercises", url: "https://sqlzoo.net/" }
    },
    node: {
      docs: { name: "Node.js API Docs", url: "https://nodejs.org/en/docs/" },
      video: { name: "Node.js Crash Course", url: "https://www.youtube.com/watch?v=Oe421EPjeEQ" },
      practice: { name: "FreeCodeCamp API Project", url: "https://www.freecodecamp.org/news/build-a-restful-api-using-node-express-and-mongodb/" }
    },
    css: {
      docs: { name: "MDN Web Docs: CSS", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      video: { name: "CSS Full Course", url: "https://www.youtube.com/watch?v=OXGznpKZ_sA" },
      practice: { name: "Frontend Mentor Challenges", url: "https://www.frontendmentor.io/challenges" }
    },
    tableau: {
      docs: { name: "Tableau Help Docs", url: "https://help.tableau.com/current/pro/desktop/en-us/default.htm" },
      video: { name: "Tableau Full Course", url: "https://www.youtube.com/watch?v=aHaOIvR00So" },
      practice: { name: "Makeover Monday", url: "https://www.makeovermonday.co.uk/" }
    },
    statistics: {
      docs: { name: "OpenIntro Statistics", url: "https://www.openintro.org/book/os/" },
      video: { name: "Statistics Full University Course", url: "https://www.youtube.com/watch?v=xxpc-HPKN28" },
      practice: { name: "Khan Academy Statistics", url: "https://www.khanacademy.org/math/statistics-probability" }
    },
    typescript: {
      docs: { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" },
      video: { name: "TypeScript Tutorials", url: "https://www.youtube.com/watch?v=BwuLxPH8IDs" },
      practice: { name: "Exercism TypeScript Track", url: "https://exercism.org/tracks/typescript" }
    },
    default: {
      docs: { name: "DevDocs Generic Search", url: "https://devdocs.io/" },
      video: { name: "FreeCodeCamp Channel", url: "https://www.youtube.com/@freecodecamp/videos" },
      practice: { name: "GitHub Explore", url: "https://github.com/explore" }
    }
  };

  const getCuratedResources = (stepTitle) => {
    const normalized = stepTitle.toLowerCase();
    for (const key of Object.keys(COURSE_DATABASE)) {
      if (key !== 'default' && normalized.includes(key)) {
        return COURSE_DATABASE[key];
      }
    }
    return COURSE_DATABASE.default;
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-40 pb-32 px-6 flex justify-center items-center">
        <Background />
        <Navbar />
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 lg:pt-40 pb-16 px-4 sm:px-6">
      <Background />
      <Navbar />

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8">
        
        <div className="w-full lg:w-[350px] flex flex-col gap-4">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-3">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Target className="w-5 h-5" />
              </span>
              Analysis Focus
            </h2>
            <div className="flex flex-col gap-3">
              <div
                className="text-left p-5 rounded-2xl bg-blue-600 border border-blue-600 text-white shadow-lg shadow-blue-500/30"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg">{selectedCareer?.title}</span>
                </div>
                {selectedCareer?.matchScore && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="text-sm font-medium text-blue-100 block mb-1">Overall Match Score</span>
                    <span className="text-3xl font-black">{selectedCareer.matchScore}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <h3 className="font-bold text-slate-800 mb-2">Resume Context</h3>
             <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                Learning path generated based on your extracted skills and target role gap analysis.
             </p>
             <button 
               onClick={() => router.push("/analysis")}
               className="w-full py-3 bg-gray-50 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
             >
                Analyze Another
             </button>
          </div>
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCareer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-2xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex justify-between items-start">
                   <div>
                      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        {selectedCareer.title}
                      </h1>
                      <p className="text-slate-500 font-medium">
                        Curated learning management content and resources customized for this role.
                      </p>
                   </div>
                   {userData?.trackingMode === 'auto' && (
                      <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-[10px] font-black animate-pulse">AUTO TRACKING ON</div>
                   )}
                </div>
              </div>

              <div className="space-y-8">
                {/* AI Recommended Videos Section */}
                {selectedCareer.learningResources && selectedCareer.learningResources.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 px-2">
                       <PlayCircle className="w-6 h-6 text-red-500" />
                       AI Recommended Videos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedCareer.learningResources.map((video, idx) => {
                        const videoId = getYouTubeId(video.url);
                        const thumbUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

                        return (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
                          >
                            {thumbUrl && (
                              <div className="relative aspect-video overflow-hidden">
                                <img 
                                  src={thumbUrl} 
                                  alt={video.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-[10px] font-bold rounded">
                                  {video.duration}
                                </div>
                              </div>
                            )}
                            <div className="p-6">
                              <div className="flex justify-between items-start mb-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                  {video.skill}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                  {video.level}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                {video.title}
                              </h3>
                              <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                                <span className="font-semibold text-slate-700">{video.channel}</span>
                              </p>
                              <p className="text-sm text-slate-600 mb-6 line-clamp-2 italic">
                                "{video.reason}"
                              </p>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-black/5"
                              >
                                <PlayCircle className="w-4 h-4" />
                                Watch Now
                              </a>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3 px-2">
                  <Map className="w-6 h-6 text-emerald-500" />
                  Your Guided Learning Series
                </h2>

                <div className="relative pl-6 sm:pl-10 space-y-8">
                  <div className="absolute top-4 bottom-4 left-[2.25rem] w-0.5 bg-gray-200 rounded-full hidden sm:block" />
                  
                  {selectedCareer.roadmap?.map((step, idx) => {
                    const title = typeof step === "string" ? step : step.title;
                    const stepNum = step.step || (idx + 1);
                    const resources = getCuratedResources(title);

                    return (
                      <div key={idx} className="relative flex flex-col sm:flex-row gap-6">
                        <div className="hidden sm:flex w-10 h-10 flex-none rounded-full bg-emerald-100 text-emerald-600 items-center justify-center font-black text-sm outline outline-4 outline-white z-10 -ml-10">
                          {stepNum}
                        </div>

                        <div className="flex-1 bg-white border border-gray-100 p-6 sm:p-8 rounded-3xl shadow-[0_8px_30_rgb(0,0,0,0.04)] hover:shadow-[0_15px_45px_rgb(0,0,0,0.06)] transition-all">
                          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                            <span className="sm:hidden w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
                               {stepNum}
                            </span>
                            Step: {title}
                          </h3>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <a
                              href={resources.docs.url}
                              onClick={() => trackAutoProgress(idx)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col gap-2 p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-100 transition-all group"
                            >
                              <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
                                <BookOpen className="w-4 h-4" /> Official Docs
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-black">
                                {resources.docs.name}
                              </span>
                            </a>
                            
                            <a
                              href={resources.video.url}
                              onClick={() => trackAutoProgress(idx)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col gap-2 p-4 rounded-2xl bg-red-50/50 hover:bg-red-50 border border-red-100 transition-all group"
                            >
                              <div className="flex items-center gap-2 text-red-600 font-bold mb-1">
                                <PlayCircle className="w-4 h-4" /> Video Course
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-black">
                                {resources.video.name}
                              </span>
                            </a>

                            <a
                              href={resources.practice.url}
                              onClick={() => trackAutoProgress(idx)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-col gap-2 p-4 rounded-2xl bg-purple-50/50 hover:bg-purple-50 border border-purple-100 transition-all group"
                            >
                              <div className="flex items-center gap-2 text-purple-600 font-bold mb-1">
                                <Target className="w-4 h-4" /> Practice Project
                              </div>
                              <span className="text-sm font-medium text-slate-700 group-hover:text-black">
                                {resources.practice.name}
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(!selectedCareer.roadmap || selectedCareer.roadmap.length === 0) && (
                    <p className="text-gray-500 text-sm">No structured roadmap available generated for this path. Please adjust the input or try another career.</p>
                  )}
                </div>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );

};

export default LearningRecommendations;
