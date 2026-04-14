import React from 'react';
import { motion } from 'framer-motion';

interface SkillTagProps {
  skill: string;
  type?: 'positive' | 'negative' | 'neutral' | 'warning';
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, type = 'neutral' }) => {
  const styles = {
    positive: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-emerald-500/5',
    negative: 'bg-rose-50 text-rose-700 border-rose-200/60 shadow-rose-500/5',
    neutral: 'bg-blue-50 text-blue-700 border-blue-200/60 shadow-blue-500/5',
    warning: 'bg-orange-50 text-orange-700 border-orange-200/60 shadow-orange-500/5',
  };


  return (
    <motion.span 
      whileHover={{ y: -2, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`px-5 py-2 rounded-2xl text-sm font-bold border backdrop-blur-md shadow-sm transition-all cursor-default flex items-center gap-2 ${styles[type]}`}
    >
      {skill}
    </motion.span>
  );
};

export default SkillTag;
