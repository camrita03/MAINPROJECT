"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const InputField = ({
  label,
  icon: Icon,
  error,
  ...props
}: InputFieldProps) => {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-sm font-semibold text-slate-600 ml-1.5 tracking-tight">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#4A90E2] transition-colors duration-300">
            <Icon size={20} strokeWidth={2.2} />
          </div>
        )}
        <input
          className={`w-full bg-slate-50/50 border border-slate-200/80 px-4 py-3.5 rounded-2xl transition-all duration-300 outline-hidden hover:border-slate-300 focus:border-[#4A90E2] focus:bg-white focus:ring-[6px] focus:ring-blue-500/5 placeholder:text-slate-400 text-slate-800 font-medium ${
            Icon ? "pl-12" : ""
          } ${error ? "border-red-300 focus:border-red-400 focus:ring-red-500/5" : ""}`}
          suppressHydrationWarning
          {...props}
        />
      </div>
      {error && <span className="text-xs font-semibold text-red-500 mt-1.5 ml-1.5">{error}</span>}
    </div>
  );
};
