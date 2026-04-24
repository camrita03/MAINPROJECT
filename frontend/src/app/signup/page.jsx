"use client";

import React, { useState } from "react";
import Link from "next/link";
import API from "../../utils/api";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
import { AuthCard } from "../../components/ui/AuthCard";
import { InputField } from "../../components/ui/InputField";
import { Button } from "../../components/ui/Button";
import { Navbar } from "../../components/Navbar";
import { Background } from "../../components/Background";

const SignupPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
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
      const { data } = await API.post("/users/register", normalizedData);

      // ✅ Save token
      localStorage.setItem("token", data.token);

      alert("Signup successful 🎉");

      router.push("/profile-setup");

    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <Navbar />
      <Background />

      <AuthCard
        title="Create Account"
        subtitle={
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">

          <InputField
            label="Full Name"
            type="text"
            icon={User}
            placeholder="Amrita"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

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
            Sign Up
          </Button>

        </form>
      </AuthCard>
    </div>
  );
};

export default SignupPage;