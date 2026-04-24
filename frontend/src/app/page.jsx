"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { 
  ArrowRight, 
  Sparkles, 
  Target, 
  Zap, 
  Upload, 
  Brain, 
  Map, 
  BookOpen, 
  BarChart3, 
  Trophy,
  ArrowDown
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Background } from "../components/Background";
import { Button } from "../components/ui/Button";

// Interactive Roadmap Card Component
function RoadmapCard({ step, index, total, scrollYProgress }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Staggered reveal based on index
  const cardOpacity = useTransform(scrollYProgress, [0.4 + (index * 0.04), 0.6 + (index * 0.04)], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0.4 + (index * 0.04), 0.6 + (index * 0.04)], [0.95, 1]);
  const cardY = useTransform(scrollYProgress, [0.4 + (index * 0.04), 0.7 + (index * 0.04)], [40, 0]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{ opacity: cardOpacity, scale: cardScale, y: cardY }}
      className="group relative flex flex-col items-center text-center p-7 w-full max-w-[280px] mx-auto rounded-3xl bg-sky-500/10 backdrop-blur-md border border-sky-200/50 shadow-sm transition-all duration-500 hover:bg-sky-500/15 hover:shadow-md hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Glow Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              rgba(56, 189, 248, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
        <step.icon size={26} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight leading-tight">{step.title}</h3>
      <p className="text-slate-600 text-sm font-medium leading-relaxed px-2">{step.desc}</p>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Split text animation: Move "Get Solid" left and "Direction" right
  const leftX = useTransform(scrollYProgress, [0, 0.4], ["0%", "-100%"]);
  const rightX = useTransform(scrollYProgress, [0, 0.4], ["0%", "100%"]);
  
  // Text visual effects
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.8]);
  
  // Roadmap content reveal effects
  const contentOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0.4, 0.7], [0.9, 1]);
  const contentY = useTransform(scrollYProgress, [0.5, 0.8], [100, 0]);

  // Cloud parallax effects
  const cloud1Pos = useTransform(scrollYProgress, [0, 0.4], [0, -30]);
  const cloud2Pos = useTransform(scrollYProgress, [0, 0.4], [0, -50]);
  const cloud3Pos = useTransform(scrollYProgress, [0, 0.4], [0, -20]);

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Background />

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex flex-col items-center">
        
        {/* HERO SECTION - Explicitly separated */}
        <section id="home" className="w-full max-w-7xl px-6 pt-32 md:pt-40 pb-8 flex flex-col items-center text-center">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={16} className="text-white" />
            <span className="text-xs font-black text-white uppercase tracking-wider">The Intelligent Way to Grow</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-6 font-display animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100 drop-shadow-sm">
            Build Your Future, <br />
            <span className="text-slate-900 drop-shadow-none">Accelerate Your Career</span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl font-semibold mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Join Yogyata and get access to personalized roadmaps, skill gap analysis, and exclusive opportunities tailored just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/signup">
              <Button className="!px-10 !py-4 text-lg !rounded-[24px]">
                Get Started for Free <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="!px-10 !py-4 text-lg border-2 border-white/20 bg-white/10 text-white backdrop-blur-md !rounded-[24px]">
                Sign In to Your Account
              </Button>
            </Link>
          </div>
        </section>

        {/* CINEMATIC SHOWCASE STRIP SECTION */}
        <section className="relative w-full py-8 md:py-12 flex flex-col items-center overflow-visible">
          <div className="relative w-full max-w-[1100px] mx-auto px-6 md:px-12 group">
            
            {/* LARGE OUTER GLOWING FRAME (Layered Depth) */}
            <div className="absolute inset-0 -m-4 md:-m-8 rounded-[40px] md:rounded-[60px] bg-white/5 backdrop-blur-3xl border border-white/10 -z-10 scale-[1.03] opacity-40 invisible md:visible blur-[2px]" />

            {/* MAIN PREMIUM GLASS FRAME CONTAINER */}
            <div className="relative z-10 w-full p-2 md:p-4 rounded-[36px] md:rounded-[56px] bg-white/10 backdrop-blur-2xl border-t border-l border-white/30 border-b-0 border-r-0 shadow-[0_24px_100px_-20px_rgba(0,0,0,0.4),0_0_30px_rgba(74,144,226,0.1)] transition-all duration-700 hover:scale-[1.01] hover:shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5),0_0_50px_rgba(74,144,226,0.2)] animate-in fade-in zoom-in-95 overflow-visible">
              
              {/* INNER CONTENT WRAPPER */}
              <div className="relative w-full h-[260px] md:h-[380px] rounded-[28px] md:rounded-[48px] overflow-hidden bg-black/40 shadow-inner">
                <img 
                  src="/assets/dark_career_showcase.png" 
                  alt="AI Hub Horizontal Showcase"
                  className="w-full h-full object-cover opacity-90 brightness-110"
                />
                
                {/* Subtle Blending Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-[#4A90E2]/30 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40 pointer-events-none" />
                
                {/* Bottom Edge Fog/Clouds */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-white/40 blur-[60px] rounded-full animate-float-slow opacity-50" />
              </div>

              {/* AI Skill Gap Analysis Card (Compact) */}
              <div className="absolute -left-4 md:-left-8 top-[55%] -translate-y-1/2 z-30 w-[200px] md:w-[280px] p-5 md:p-7 rounded-[32px] bg-white/95 backdrop-blur-3xl border border-white shadow-2xl -rotate-3 animate-float transition-all hover:rotate-0 duration-500">
                 <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <Sparkles size={18} />
                      </div>
                      <h3 className="text-sm md:text-base font-black text-slate-800 leading-tight">AI Skill Analysis</h3>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        "Your resume analyzed",
                        "Personalized roadmap"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                             <ArrowRight size={8} strokeWidth={4} />
                          </div>
                          <span className="text-[10px] md:text-sm font-bold text-slate-600 tracking-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              {/* 3D Object (Compact) */}
              <div className="absolute -right-2 md:right-12 -top-10 z-30 w-16 h-16 md:w-28 md:h-28 animate-float delay-700 invisible md:visible">
                <div className="relative w-full h-full p-2 rounded-[28px] bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl flex items-center justify-center rotate-12 transition-transform duration-700">
                  <div className="w-full h-full rounded-[22px] bg-linear-to-tr from-blue-500 to-indigo-600 shadow-xl flex items-center justify-center text-white">
                    <Target size={32} strokeWidth={2} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultra-Seamless Cloud Divider Layer */}
          <div className="absolute -bottom-32 left-0 right-0 h-64 pointer-events-none z-30 overflow-hidden">
            {/* Primary Blending Gradient - Multi-stop for extreme smoothness */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-linear-to-t from-white via-white via-white/80 via-white/40 to-transparent z-10" />
            
            {/* Soft Mist Parallax Layers */}
            <motion.div 
              style={{ y: cloud1Pos }}
              className="absolute -left-[10%] w-[140%] -bottom-10 h-40 bg-white blur-[100px] opacity-90 rounded-[50%] animate-float-slow scale-y-[0.4]" 
            />
            
            <motion.div 
              style={{ y: cloud2Pos }}
              className="absolute -left-[20%] w-[140%] -bottom-20 h-48 bg-white blur-[120px] opacity-75 rounded-[50%] animate-float-slow delay-700 scale-y-[0.3]"
            />
            
            {/* Final Clean Blending Anchor - Smooth Gradient only, no solid bar */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white via-white to-transparent z-20" />
          </div>
        </section>

        {/* CURTAIN SPLIT REVEAL SECTION */}
        <section ref={containerRef} className="relative h-[300vh] w-full mt-0">
          {/* Sticky Reveal Wrapper */}
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-20 pt-0">
            
            {/* White Background Layer with Subtle Grid */}
            <div className="absolute inset-0 bg-white z-0">
              <div 
                className="absolute inset-0 opacity-[0.03]" 
                style={{
                  backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                  backgroundSize: '32px 32px'
                }}
              />
            </div>

            {/* Background Layer: Roadmap Cards (Revealed) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto z-10">
              <div className="w-full max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {[
                    { icon: Upload, title: "Upload Resume", desc: "Start by uploading your resume for analysis" },
                    { icon: Brain, title: "AI Skill Analysis", desc: "We analyze your skills and identify gaps" },
                    { icon: Map, title: "Learning Path", desc: "Get a curated roadmap for your target role" },
                    { icon: BookOpen, title: "Resources", desc: "Access courses and real-world projects" },
                    { icon: BarChart3, title: "Track Progress", desc: "Monitor your growth and improvement" },
                    { icon: Trophy, title: "Career Goal", desc: "Become job-ready and land your role" }
                  ].map((step, i, arr) => (
                    <RoadmapCard key={i} step={step} index={i} total={arr.length} scrollYProgress={scrollYProgress} />
                  ))}
                </div>
              </div>
            </div>

            {/* Front Layer: The "Curtain" Splitting Text */}
            <div className="relative z-30 pointer-events-none w-full max-w-screen-2xl mx-auto flex flex-col items-center px-4">
              <div className="flex flex-col xl:flex-row items-center justify-center gap-0 xl:gap-12 text-center text-slate-900">
                <motion.span 
                  style={{ x: leftX, opacity: textOpacity, scale: textScale }}
                  className="text-5xl md:text-[120px] font-black font-display tracking-tighter leading-none whitespace-nowrap"
                >
                  Get Solid
                </motion.span>
                <motion.span 
                  style={{ x: rightX, opacity: textOpacity, scale: textScale }}
                  className="text-5xl md:text-[120px] font-black font-display tracking-tighter leading-none whitespace-nowrap"
                >
                  Direction
                </motion.span>
              </div>
            </div>
          </div>
        </section>



        {/* FEATURES GRID SECTION */}
        <section id="features" className="w-full max-w-7xl px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: Target, title: "Personalized Roadmap", desc: "AI-generated step-by-step career plans tailored to your goals." },
            { icon: Sparkles, title: "AI Skill Analysis", desc: "Identify your strengths and gaps with intelligent diagnostics." },
            { icon: Zap, title: "Direct Placement", desc: "Fast-track your interview process with premium partner companies." }
          ].map((feature, i) => (
            <div key={i} className="group relative p-10 rounded-[48px] bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/15 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-white/20 to-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                <feature.icon size={30} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 font-display leading-tight">{feature.title}</h3>
              <p className="text-white/70 font-semibold leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="py-20 w-full border-t border-white/10 bg-black/5 backdrop-blur-sm px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#4A90E2] shadow-2xl">
                <span className="text-2xl font-black italic">Y</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight font-display">
                Yogyata
              </span>
          </div>
          <p className="text-white/40 font-bold text-sm">
            &copy; 2026 Yogyata Platforms Inc. All Rights Reserved.
          </p>
          <div className="flex gap-10">
            {["Terms", "Privacy", "Contact"].map((item) => (
              <a key={item} href="#" className="text-sm font-bold text-white/40 hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

