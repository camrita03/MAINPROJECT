"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  isLoading,
  className = "",
  ...props
}: ButtonProps) => {
  const baseStyles = "relative px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed group overflow-hidden active:scale-[0.97]";
  
  const variants = {
    primary: "bg-linear-to-b from-[#4A90E2] to-[#3B82F6] text-white shadow-[0_4px_14px_0_rgba(59,130,246,0.35)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.45)] hover:to-[#2563EB]",
    secondary: "bg-white text-slate-800 border border-slate-200/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:bg-slate-50 hover:border-slate-300",
    outline: "bg-transparent border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2]/5 hover:shadow-[0_0_15px_rgba(74,144,226,0.1)]",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Shine Effect Overlay for Primary */}
      {variant === "primary" && (
        <span className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/10 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}
      
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
};
