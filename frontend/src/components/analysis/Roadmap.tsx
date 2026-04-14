import React from 'react';
import { motion } from 'framer-motion';
import { Map, CheckCircle, ArrowRight } from 'lucide-react';

interface Step {
  step: number;
  title: string;
}

interface RoadmapProps {
  roadmap: Step[];
}

const Roadmap: React.FC<RoadmapProps> = ({ roadmap }) => {
  return (
    <div className="w-full mt-16 bg-white/60 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-blue-100/50 text-blue-600">
          <Map className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your Personalized Career Roadmap</h2>
          <p className="text-slate-500 font-medium mt-1">A step-by-step path to bridge your skill gap</p>
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-[2.25rem] w-1 bg-slate-100 rounded-full" />
        
        <div className="space-y-6">
          {roadmap.map((item, index) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center gap-8 group"
            >
              <div className="w-[4.5rem] flex-none flex items-center justify-center relative z-10">
                <div className="w-12 h-12 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center text-slate-400 font-black shadow-sm group-hover:border-blue-200 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300">
                  {item.step}
                </div>
              </div>
              
              <div className="flex-1 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex justify-between items-center group-hover:-translate-y-1">
                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
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
