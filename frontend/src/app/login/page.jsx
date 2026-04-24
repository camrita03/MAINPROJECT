"use client";

import React, { useState } from "react";
import Link from "next/link";
import API from "../../utils/api";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import { AuthCard } from "../../components/ui/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Button } from "../../components/ui/Button";
import { Navbar } from "../../components/Navbar";
import { Background } from "../../components/Background";

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const normalizedData = {
        ...formData,
        email: formData.email.toLowerCase().trim()
      };
      const { data } = await API.post("/users/login", normalizedData);

      // ✅ Save token & status
      localStorage.setItem("token", data.token);

      alert("Login successful 🚀");

      // Redirect based on state
      if (!data.profileCompleted) {
        router.push("/profile-setup");
      } else if (!data.resumeUploaded) {
        router.push("/analysis");
      } else {
        router.push("/analysis/result");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <Navbar />
      <Background />

      {/* Hero Section */}
      <div className="mb-14 text-center max-w-2xl px-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
          Start your journey with{" "}
          <span className="px-6 py-2 bg-slate-900 text-white rounded-full">
            Yogyata
          </span>
        </h1>
        <p className="text-lg text-slate-500">
          Your AI-powered career guidance platform.
        </p>
      </div>

      <AuthCard
        title="Welcome Back"
        subtitle={
          <>
            New here?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Create account
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          <InputField
            label="Email"
            type="email"
            icon={Mail}
            placeholder="name@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <InputField
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Button type="submit" isLoading={loading} className="w-full h-12">
            Login <LogIn size={18} className="ml-1" />
          </Button>

        </form>
      </AuthCard>
    </div>
  );
};

export default LoginPage;