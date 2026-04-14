"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
import { AuthCard } from "@/components/ui/AuthCard";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Login successful!");
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
          The all-in-one AI platform to map your career, find skill gaps, and land your dream job.
        </p>
      </div>

      <AuthCard
        title="Welcome Back"
        subtitle={
          <>
            New to Yogyata?{" "}
            <Link
              href="/signup"
              className="text-[#4A90E2] font-semibold hover:underline"
            >
              Create an account
            </Link>
          </>
        }
        className="animate-in fade-in zoom-in-95 duration-500"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Work Email"
            type="email"
            placeholder="name@company.com"
            icon={Mail}
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#4A90E2] hover:text-[#357ABD] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <InputField
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full mt-4 h-12">
            Login <LogIn size={18} className="ml-1" />
          </Button>

          <p className="text-center text-slate-400 text-xs mt-6 px-4">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
          </p>
        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;
