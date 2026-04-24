import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  "Extracting skills...",
  "Matching with job role...",
  "Generating insights...",
  "Formatting results..."
];

const Loader = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 space-y-16">
      <div className="relative flex items-center justify-center">
        {/* Outer Orbit */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-44 h-44 border border-blue-200/30 rounded-full border-dashed"
        />
        
        {/* Main Spinning Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 border-[3px] border-blue-100 border-t-blue-600 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.1)]"
        />

        {/* Inner Counter-spinning Ring */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute w-20 h-20 border-[3px] border-indigo-100 border-t-indigo-500/50 rounded-full"
        />

        {/* Center Pulse Core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-6 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
          />
        </div>
      </div>
      
      <div className="text-center space-y-8 max-w-lg">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Synthesizing Data
          </h2>
          <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px] space-x-2">
            <span>Advanced AI Scan</span>
            <span className="text-blue-200">•</span>
            <span>Neural Matching</span>
          </p>
        </div>

        <div className="relative h-3 w-72 mx-auto bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 6, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent animate-shimmer" />
        </div>

        <div className="h-10">
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-blue-600 font-black text-xl italic"
            >
              {steps[currentStep]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Loader;
