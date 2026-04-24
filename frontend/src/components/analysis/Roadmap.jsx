import React from 'react';
import { motion } from 'framer-motion';
import { Map, CheckCircle, ArrowRight } from 'lucide-react';

const Roadmap = ({ roadmap }) => {
  return (
    <div className="w-full mt-8 bg-white/60 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-[1rem] bg-blue-100/50 text-blue-600">
          <Map className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Personalized Career Roadmap</h2>
          <p className="text-slate-500 text-sm font-medium mt-1">A step-by-step path to bridge your skill gap</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[2.25rem] w-1 bg-slate-100 rounded-full" />
        
        <div className="space-y-6">
          {roadmap.map((item, index) => (
            <motion.div 
              key={item.step || `roadmap-step-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center gap-8 group"
            >
              <div className="w-[3.5rem] flex-none flex items-center justify-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-slate-400 font-bold shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 transition-all duration-300 transform group-hover:scale-105">
                  {item.step || (index + 1)}
                </div>
              </div>
              
              <div className="flex-1 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex justify-between items-center group-hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-800">{typeof item === 'string' ? item : item.title}</h3>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
