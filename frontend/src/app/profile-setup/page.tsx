"use client";

import React, { useState } from "react";
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
  BarChart, 
  FileUp, 
  Globe, 
  Code,
  CheckCircle2,
  AlertCircle,
  Target
} from "lucide-react";

export default function ProfileSetup() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
    resume: null as File | null,
    linkedin: "",
    github: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, resume: e.target.files![0] }));
      if (errors.resume) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.resume;
          return newErrors;
        });
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.resume) newErrors.resume = "Please upload your resume";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Background />
        <Navbar />
        <div className="relative z-10 max-w-md w-full bg-white rounded-[32px] p-12 shadow-2xl text-center border border-slate-100 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 text-green-600">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Profile Setup Complete!</h1>
          <p className="text-slate-600 mb-8 font-medium">Your career journey with Yogyata begins now. We'll analyze your profile and prepare a solid roadmap for you.</p>
          <Button className="w-full !py-4 text-lg !font-bold !rounded-2xl shadow-lg shadow-blue-200" onClick={() => window.location.href = "/"}>
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Complete Your Profile</h1>
          <p className="text-slate-600 font-bold max-w-lg mx-auto">
            Tell us about your background and goals so we can craft the perfect career path for you.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.08)] border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* Section 1: Basic Information */}
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
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.fullName ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:bg-white'} rounded-[20px] outline-none transition-all font-medium text-slate-900`}
                    />
                    {errors.fullName && <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mt-2 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.fullName}</div>}
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
                      placeholder="john@example.com"
                      className={`w-full pl-12 pr-4 py-4 bg-slate-50 border ${errors.email ? 'border-red-300 ring-4 ring-red-50' : 'border-slate-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:bg-white'} rounded-[20px] outline-none transition-all font-medium text-slate-900`}
                    />
                    {errors.email && <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mt-2 ml-1 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.email}</div>}
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

            {/* Section 2: Education */}
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

            {/* Section 3: Career Info */}
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

            <hr className="border-slate-50" />

            {/* Section 4: Resume & Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600">
                    <FileUp size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Resume Upload *</h2>
                </div>
                
                <div className={`relative border-2 border-dashed ${errors.resume ? 'border-red-300 bg-red-50/30' : 'border-slate-200 hover:border-slate-400'} rounded-[32px] p-10 transition-all text-center group cursor-pointer`}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      <FileUp size={28} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">
                        {formData.resume ? formData.resume.name : "Click or drag to upload"}
                      </p>
                      <p className="text-xs text-slate-500 font-bold mt-1">PDF, DOC (Max 5MB)</p>
                    </div>
                  </div>
                  {errors.resume && <div className="flex items-center justify-center gap-1.5 text-red-500 text-xs font-bold mt-4 animate-in slide-in-from-top-1"><AlertCircle size={12}/> {errors.resume}</div>}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                    <Globe size={20} />
                  </div>
                  <h2 className="text-xl font-black text-slate-800">Social Links</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/username"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                  <div className="relative">
                    <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="github.com/username"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-slate-800 focus:ring-4 focus:ring-slate-50 focus:bg-white rounded-[20px] outline-none transition-all font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8">
              <Button 
                type="submit" 
                className="w-full !py-5 text-xl !font-bold !rounded-[24px] shadow-2xl shadow-blue-200 transition-all active:scale-[0.98]"
                isLoading={loading}
              >
                {loading ? "Optimizing Profile..." : "Save & Continue to Roadmap"}
              </Button>
              <p className="text-center text-slate-400 text-xs font-bold mt-5 tracking-tight uppercase">
                Secure 256-bit SSL encrypted data handling
              </p>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
