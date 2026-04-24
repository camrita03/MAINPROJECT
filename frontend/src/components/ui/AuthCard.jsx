"use client";

import React from "react";

export const AuthCard = ({ children, className = "", title = "", subtitle = null }) => {
  return (
    <div className={`w-full max-w-[480px] p-10 md:p-12 rounded-[40px] bg-white/80 backdrop-blur-3xl border border-white/60 shadow-[0_32px_64px_-16px_rgba(30,58,138,0.12),0_16px_32px_-8px_rgba(30,58,138,0.08)] relative z-10 ${className}`}>
      {/* Decorative Gradient Border Glow */}
      <div className="absolute inset-0 rounded-[40px] border border-white/40 pointer-events-none" />
      
      <div className="mb-12 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4 font-display text-center leading-[1.1]">
          {title}
        </h2>
        {subtitle && (
          <div className="text-slate-500 font-semibold text-center text-sm tracking-wide">
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
