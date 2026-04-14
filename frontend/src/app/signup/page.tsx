"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, UserPlus, CheckCircle2 } from "lucide-react";
import { AuthCard } from "@/components/ui/AuthCard";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully!");
    }, 2000);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <Navbar />
      <Background />

      {/* Hero-style Content */}
      <div className="mb-14 text-center max-w-2xl px-4 animate-in fade-in slide-in-from-top-10 duration-1000 ease-out">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight font-display mb-6">
          Start your journey with{" "}
          <span className="relative inline-block px-8 py-3 bg-slate-900 text-white rounded-full text-3xl md:text-4xl shadow-2xl shadow-slate-300 ring-8 ring-slate-900/5">
            Yogyata
          </span>
        </h1>
        <p className="text-xl text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
          Create your account to start your journey towards your dream career today.
        </p>
      </div>

      <AuthCard
        title="Create Account"
        subtitle={
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#4A90E2] font-semibold hover:underline"
            >
              Login
            </Link>
          </>
        }
        className="animate-in fade-in zoom-in-95 duration-500"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Full Name"
            type="text"
            placeholder="John Doe"
            icon={User}
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <InputField
            label="Work Email"
            type="email"
            placeholder="john@company.com"
            icon={Mail}
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />

          <div className="flex items-start gap-2 pt-2 px-1">
            <CheckCircle2 size={16} className="text-[#4A90E2] shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium">
              I agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
            </p>
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-4 h-12">
            Create Account <UserPlus size={18} className="ml-1" />
          </Button>

          <p className="text-center text-slate-400 text-[10px] mt-6 uppercase tracking-wider font-bold">
            Trusted by 5,000+ professionals worldwide
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default SignupPage;
