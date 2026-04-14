import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface UploadBoxProps {
  onAnalyze: (file: File, role: string) => void;
  isLoading: boolean;
}

const UploadBox: React.FC<UploadBoxProps> = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".doc") || droppedFile.name.endsWith(".docx")) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
          border-3 border-dashed rounded-[3rem] p-16 text-center
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/80 scale-[1.03] shadow-[0_40px_80px_rgba(59,130,246,0.2)]' 
            : 'border-slate-200 bg-white/60 hover:border-blue-400 hover:bg-white/90 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]'
          }
          backdrop-blur-3xl`}
      >
        <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          <motion.div 
            animate={file ? { 
              scale: [1, 1.15, 1],
              rotate: [0, 8, -8, 0],
              boxShadow: [
                "0 0 0px rgba(16, 185, 129, 0)",
                "0 0 40px rgba(16, 185, 129, 0.4)",
                "0 0 0px rgba(16, 185, 129, 0)"
              ]
            } : {}}
            className={`p-6 rounded-[2.5rem] transition-all duration-700 ${file ? 'bg-emerald-100 shadow-xl' : 'bg-blue-50/50'}`}
          >
            {file ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            ) : (
              <Upload className="w-12 h-12 text-blue-600 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500" />
            )}
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              {file ? file.name : "Drop your resume here"}
            </h3>
            <p className="text-slate-500 font-bold tracking-wide uppercase text-[11px] opacity-60">
              PDF • DOC • DOCX (Max 5MB)
            </p>
          </div>
          
          {file && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-6 py-2 rounded-2xl bg-emerald-50 text-emerald-700 font-black text-xs flex items-center gap-2 border border-emerald-100/50 shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              RESUME LOADED
            </motion.div>
          )}

          {!file && (
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black tracking-widest uppercase opacity-40 mt-2">
              <ShieldCheck className="w-3 h-3" />
              End-to-end encrypted
            </div>
          )}
        </div>
      </div>

      <div className="relative z-30 space-y-2">
        <label htmlFor="role" className="block text-sm font-bold text-slate-700 ml-2">
          Desired Job Role <span className="text-red-500">*</span>
        </label>
        <input
          id="role"
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter your target role (e.g., Frontend Developer, Data Analyst)"
          className="w-full px-6 py-5 rounded-[2rem] border-2 border-slate-200 bg-white/80 backdrop-blur-xl text-slate-900 font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
        />
      </div>

      <motion.button
        whileHover={{ 
          scale: 1.01,
          y: -4,
          boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.4)"
        }}
        whileTap={{ scale: 0.99 }}
        onClick={() => file && role && onAnalyze(file, role)}
        disabled={!file || !role || isLoading}
        className={`w-full py-6 rounded-[2.5rem] font-black text-xl tracking-tight transition-all relative overflow-hidden group
          ${file && role && !isLoading
            ? 'bg-blue-600 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)]'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          {isLoading ? 'Analyzing Profile...' : 'Analyze My Profile'}
          {!isLoading && file && role && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
        </span>
        {file && role && !isLoading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        )}
      </motion.button>
    </motion.div>
  );
};

export default UploadBox;
