"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../utils/api";



import { Navbar } from "../../components/Navbar";
import { Background } from "../../components/Background";
import UploadBox from "../../components/analysis/UploadBox";
import Loader from "../../components/analysis/Loader";

const AnalysisPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  // 🚀 AI FUNCTION
  // 🚀 AI FUNCTION
  const handleAnalyze = async (file, roleInput) => {
    if (!roleInput.trim()) {
      alert("Please enter your desired job role first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to analyze your resume! 🔐");
      router.push("/login"); // Optional, but helps UX
      return;
    }

    try {
      setStatus("loading");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", roleInput);

      const { data } = await API.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ STORE & NAVIGATE
      localStorage.setItem(
        "analysisResult",
        JSON.stringify({ ...data, role: roleInput })
      );
      router.push("/analysis/result");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403 && err.response?.data?.step === "profile") {
        alert("Please complete your profile first to analyze resume! 👤");
        router.push("/profile-setup");
      } else if (err.response?.status === 401) {
        alert("Session expired or invalid login. Please login again. 🔐");
        router.push("/login");
      } else {
        alert(err.response?.data?.message || "Error analyzing resume");
      }
      setStatus("idle");
    }
  };

  return (
    <main className="min-h-screen pt-40 pb-32 px-6">
      <Background />
      <Navbar />

      <div className="max-w-[1300px] mx-auto">
        <AnimatePresence mode="wait">

          {/* 🟢 UPLOAD */}
          {status === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-black to-gray-500 bg-clip-text text-transparent">
                  Resume Analyzer 🚀
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  Upload your resume and enter your target role. Our AI will analyze the gap and provide a custom roadmap for your career.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <UploadBox onAnalyze={handleAnalyze} isLoading={false} />
              </div>
            </motion.div>
          )}

          {/* 🟡 LOADING */}
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[50vh] gap-8"
            >
              <Loader />
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold animate-pulse">Analyzing Resume...</h3>
                <p className="text-gray-500">Generating your personalized career roadmap & AI advice.</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );

};

export default AnalysisPage;