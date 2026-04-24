"use client";

import React from "react";

export const Background = () => {
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden">
      {/* Soft Sky Blue Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#6BBEFF] to-[#4A90E2]" />
      
      {/* Base Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.08]" 
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />

      {/* Animated Vertical Moving Line */}
      <div className="absolute left-[20%] top-0 bottom-0 w-[1px] bg-white/20 blur-[1px] animate-grid-move" />
      <div className="absolute left-[80%] top-0 bottom-0 w-[1px] bg-white/10 blur-[1px] animate-grid-move delay-5000" />

      {/* Floating Shapes / Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/15 blur-[150px] animate-pulse" />
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#6BBEFF]/20 blur-[120px]" />
      
      {/* Subtle Bottom Fog/Clouds */}
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-linear-to-t from-[#4A90E2] to-transparent pointer-events-none" />
    </div>
  );
};
