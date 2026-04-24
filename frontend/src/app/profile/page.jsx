"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import API from "../../utils/api";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";
import { Button } from "@/components/ui/Button";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building2, 
  Calendar, 
  Briefcase, 
  Wrench, 
  CheckCircle2,
  AlertCircle,
  Target,
  Globe,
  Code,
  Map,
  Settings,
  Circle,
  Activity,
  History,
  LayoutDashboard,
  Lock
} from "lucide-react";

export default function ProfileSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [view, setView] = useState("form"); // "form" or "dashboard"
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    college: "",
    year: "",
    desiredRole: "",
    skills: "",
    experience: "Beginner",
    linkedin: "",
    github: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.get("/users/profile");
      setUserData(data);
      if (data.profileCompleted) {
        setView("dashboard");
        if (data.resumeUploaded) {
           fetchJobs();
        }
      } else {
        setFormData(prev => ({
          ...prev,
          fullName: data.name || "",
          email: data.email || ""
        }));
      }
    } catch (err) {
      console.error("Fetch profile failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    try {
      setJobsLoading(true);
      const { data } = await API.get("/jobs/recommendations");
      setJobs(data.recommendedJobs || []);
    } catch (err) {
      console.error("Fetch jobs failed:", err);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors["fullName"] = "Full name is required";
    if (!formData.email) newErrors["email"] = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors["email"] = "Invalid email format";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await API.put("/users/profile", {
        targetRole: formData.desiredRole,
        profileData: {
          phone: formData.phone,
          qualification: formData.qualification,
          college: formData.college,
          year: formData.year,
          skills: formData.skills,
          experience: formData.experience,
        }
      });
      setSubmitted(true);
      fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async () => {
    const newMode = userData.trackingMode === "auto" ? "manual" : "auto";
    try {
      await API.post("/performance/mode", { mode: newMode });
      setUserData(prev => ({
        ...prev,
        trackingMode: newMode
      }));
    } catch (err) {
      alert("Failed to switch mode");
    }
  };

  const handleStepToggle = async (index) => {
    if (userData.trackingMode === "auto") return;

    try {
      const { data } = await API.post("/performance/update-step", { stepIndex: index });
      setUserData(prev => ({
        ...prev,
        performance: data.performance
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update progress");
    }
  };

  if (loading && !userData) {
    return (
      <main className="min-h-screen pt-40 pb-32 px-6 flex flex-col items-center justify-center">
        <Background />
        <Navbar />
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">Syncing career profile...</p>
      </main>
    );
  }

  if (view === "dashboard") {
    return (
      <main className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6">
        <Background />
        <Navbar />
        
        <div className="max-w-7xl mx-auto space-y-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <LayoutDashboard className="text-blue-600" />
                  Career Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-1">
                   <p className="text-slate-500 font-bold">Welcome back, {userData.name} 👋</p>
                   <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg text-[10px] font-black flex items-center gap-1">
                      🔥 STREAK: {userData.performance?.streak || 0} DAYS
                   </span>
                </div>
             </div>
             <div className="flex bg-white/80 backdrop-blur-xl border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                <button 
                   onClick={toggleMode}
                   className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${userData.trackingMode === 'auto' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                   AUTO MODE
                </button>
                <button 
                   onClick={toggleMode}
                   className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${userData.trackingMode === 'manual' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                   MANUAL
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Basic Profile</h3>
                <p className="text-slate-900 font-black text-lg">{userData.name}</p>
                <div className="flex flex-col gap-1 mt-2">
                   <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Mail size={14} /> {userData.email}
                   </div>
                   <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Phone size={14} /> {userData.profileData?.phone || "Not set"}
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col gap-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Resume Status</h3>
                <p className="text-slate-900 font-black text-lg">
                   {userData.resumeUploaded ? "✅ Uploaded" : "❌ No Resume"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                   {(userData.analysis?.skills || []).slice(0, 3).map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">{skill}</span>
                   ))}
                   {userData.analysis?.skills?.length > 3 && (
                      <span className="text-[10px] items-center flex font-bold text-slate-400">+{userData.analysis.skills.length - 3} more</span>
                   )}
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl border border-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 flex flex-col gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Current Level</h3>
                <div className="flex items-center gap-3">
                   <p className="text-slate-900 font-black text-lg">{userData.performance?.level || "Beginner"}</p>
                   <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[9px] font-black uppercase tracking-tighter">
                      {(userData.performance?.progress || 0) < 30 ? "LV 1" : (userData.performance?.progress || 0) < 70 ? "LV 2" : "LV 3"}
                   </span>
                </div>
                <div className="mt-2 space-y-1">
                   <div className="flex justify-between items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{userData.performance?.progress || 0}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${userData.performance?.progress || 0}%` }} />
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 space-y-6">
                <div className="bg-white/90 backdrop-blur-3xl border border-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/5">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                         <Map className="text-emerald-500" />
                         Learning Roadmap
                      </h2>
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                         <Activity className="text-blue-500" size={16} />
                         <span className="text-sm font-black text-slate-800">{userData.performance?.progress || 0}% Complete</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {userData.analysis?.roadmap?.map((step, idx) => {
                         const title = typeof step === "string" ? step : step.title;
                         const isCompleted = userData.performance?.completedSteps?.includes(idx);
                         
                         return (
                            <div 
                               key={idx}
                               onClick={() => handleStepToggle(idx)}
                               className={`group flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all cursor-pointer ${isCompleted ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : 'bg-white border-slate-50 hover:border-slate-200'}`}
                            >
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'}`}>
                                  {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                               </div>
                               <div className="flex-1">
                                  <p className={`font-black text-sm ${isCompleted ? 'text-emerald-700' : 'text-slate-800'}`}>{title}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">LEARNING MODULE {idx + 1}</p>
                               </div>
                               {userData.trackingMode === 'manual' && (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                     <p className="text-[10px] font-black text-blue-600 underline">MARK AS {isCompleted ? 'PENDING' : 'DONE'}</p>
                                  </div>
                               )}
                            </div>
                         )
                      })}
                      {(!userData.analysis?.roadmap || userData.analysis.roadmap.length === 0) && (
                         <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                            <p className="text-slate-400 font-bold">No roadmap found. Please upload your resume first.</p>
                            <Button className="mt-4" onClick={() => router.push("/analysis")}>Go to Analysis</Button>
                         </div>
                      )}
                   </div>
                </div>

                {/* Job Recommendations Section */}
                <div className="bg-white/90 backdrop-blur-3xl border border-white p-8 rounded-[40px] shadow-2xl shadow-blue-900/5">
                   <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                         <Briefcase className="text-blue-500" />
                         AI Job Recommendations
                      </h2>
                      {userData.performance?.progress === 100 ? (
                         <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl">
                            <Target className="text-blue-500" size={16} />
                            <span className="text-sm font-black text-blue-800">READY TO APPLY</span>
                         </div>
                      ) : (
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-2xl">
                            <Lock className="text-slate-400" size={16} />
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest text-[10px]">Locked</span>
                         </div>
                      )}
                   </div>

                   {userData.performance?.progress < 100 ? (
                      <div className="p-20 text-center flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 group">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                            <Lock size={32} />
                         </div>
                         <h3 className="text-xl font-black text-slate-800 mb-2">Unlock Career Opportunities</h3>
                         <p className="text-slate-500 font-bold max-w-sm mx-auto mb-8 leading-relaxed">
                            Complete your personalized roadmap to 100% to unlock AI-verified job matches tailored to your mastered skills.
                         </p>
                         <div className="w-full max-w-xs h-3 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${userData.performance?.progress || 0}%` }} />
                         </div>
                         <span className="text-xs font-black text-blue-600 mt-3 uppercase tracking-widest">
                            Current Progress: {userData.performance?.progress || 0}%
                         </span>
                      </div>
                   ) : jobsLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                         <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                         <p className="text-slate-500 font-bold">Scanning for top opportunities...</p>
                      </div>
                   ) : jobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                         {jobs.map((job, idx) => (
                            <div key={idx} className="group bg-slate-50/50 hover:bg-white p-6 rounded-[32px] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl hover:shadow-blue-500/5">
                               <div className="flex justify-between items-start mb-4">
                                  <div>
                                     <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-wider mb-2 inline-block">
                                        {job.level}
                                     </span>
                                     <h3 className="text-lg font-black text-slate-900 leading-tight">{job.title}</h3>
                                     <p className="text-sm font-bold text-slate-500">{job.company}</p>
                                  </div>
                                  <div className="flex flex-col items-end">
                                     <span className="text-xl font-black text-blue-600">{job.matchScore}%</span>
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Match Score</span>
                                  </div>
                               </div>

                               <div className="flex flex-wrap gap-2 mb-4">
                                  {job.skillsRequired?.map(skill => (
                                     <span key={skill} className="px-2 py-0.5 bg-white border border-slate-100 rounded-md text-[10px] font-bold text-slate-600">{skill}</span>
                                  ))}
                               </div>

                               <p className="text-xs text-slate-600 mb-6 italic line-clamp-2">"{job.reason}"</p>

                               <button className="w-full py-3 bg-white border border-slate-200 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white rounded-xl font-bold text-sm transition-all shadow-sm">
                                  View & Apply
                               </button>
                            </div>
                         ))}
                      </div>
                   ) : (
                      <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
                         <p className="text-slate-400 font-bold">No jobs matching your profile were found. Try updating your roadmap focus.</p>
                      </div>
                   )}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[40px] text-white shadow-2xl shadow-blue-600/20">
                   <h3 className="text-xl font-black mb-2 tracking-tight">Active Milestone</h3>
                   <p className="text-blue-100 font-medium text-sm mb-6 opacity-80 italic">"Small steps lead to massive achievements. Keep pushing!"</p>
                   
                   <div className="space-y-4">
                      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                         <div className="flex items-center gap-3">
                            <History className="text-blue-200" size={18} />
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Current Focus</p>
                               <p className="text-sm font-bold truncate">Continue your roadmap journey</p>
                            </div>
                         </div>
                      </div>
                      <Button 
                        onClick={() => router.push("/analysis/result")}
                        className="w-full !bg-white !text-blue-600 !py-4 !rounded-2xl !font-black !text-sm hover:!bg-blue-50"
                      >
                         View Full Analysis
                      </Button>
                   </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-[32px] shadow-lg shadow-slate-200/50">
                    <h4 className="text-slate-900 font-black mb-4 flex items-center gap-2">
                       <Settings size={18} className="text-slate-400" />
                       Quick Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                       <button 
                          onClick={() => setView("form")}
                          className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-center transition-all"
                       >
                          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-600 shadow-sm">
                             <User size={16} />
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase">Edit Profile</span>
                       </button>
                       <button 
                          onClick={() => router.push("/analysis")}
                          className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-center transition-all"
                       >
                          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mx-auto mb-2 text-slate-600 shadow-sm">
                             <Map size={16} />
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase">New Analysis</span>
                       </button>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Background />
        <Navbar />
        <div className="relative z-10 max-w-md w-full bg-white rounded-[32px] p-12 shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Profile Updated!</h1>
          <p className="text-slate-600 mb-8 font-medium">Your career journey with Yogyata is updated. Head to your dashboard to track your progress.</p>
          <Button className="w-full !py-4 text-lg !font-bold !rounded-2xl shadow-lg shadow-blue-200" onClick={() => setView("dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-50 pt-32 pb-20">
      <Background />
      <Navbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Career Profile Setup</h1>
          <p className="text-slate-600 font-bold max-w-lg mx-auto">
            Tell us about your background and goals so we can craft the perfect career path for you.
          </p>
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.08)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                  <User size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors["fullName"] ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:bg-white'} rounded-[20px] outline-none transition-all font-medium text-slate-900`}
                    />
                    {errors["fullName"] && <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mt-2 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors["fullName"]}</div>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly
                      placeholder="john@example.com"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-100 border border-slate-100 rounded-[20px] outline-none transition-all font-medium text-slate-400 cursor-not-allowed`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-50" />

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                  <GraduationCap size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Academic Background</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Current Qualification</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900 appearance-none"
                    >
                      <option value="">Select Option</option>
                      <option value="B.Tech">B.Tech / B.E</option>
                      <option value="BCA">BCA / MCA</option>
                      <option value="B.Sc">B.Sc Computer Science</option>
                      <option value="MBA">MBA / PGDM</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-1 lg:col-span-1">
                  <label className="text-sm font-bold text-slate-700 ml-1">College Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="University of Excellence"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Year of Study</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      placeholder="2025"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-50" />

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                  <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-800">Career aspirations</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Desired Job Role</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="desiredRole"
                      value={formData.desiredRole}
                      onChange={handleChange}
                      placeholder="Full Stack Developer"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Skills (e.g. React, Python)</label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="JavaScript, AWS, SQL"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Experience Level</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["Beginner", "Intermediate", "Advanced"].map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, experience: lv }))}
                        className={`py-4 px-2 rounded-[20px] font-bold text-sm transition-all border-2 ${formData.experience === lv ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'}`}
                      >
                        {lv}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button 
                type="submit" 
                className="w-full !py-5 text-xl !font-bold !rounded-[24px] shadow-2xl shadow-blue-200 transition-all active:scale-[0.98]"
                isLoading={loading}
              >
                {loading ? "Optimizing Profile..." : "Save Profile & Head to Dashboard"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
