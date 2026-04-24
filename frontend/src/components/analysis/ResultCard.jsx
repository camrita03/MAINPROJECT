import React from 'react';
import { motion } from 'framer-motion';

const ResultCard = ({ title, children, icon = null, className = "", delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay 
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className={`relative group bg-white/70 backdrop-blur-2xl border border-white/50 p-6 rounded-[2rem] 
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] 
        transition-all duration-500 overflow-hidden ${className}`}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <div className="p-3 rounded-[1rem] bg-blue-600/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-none">{title}</h3>
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
