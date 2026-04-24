"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import API from "../../utils/api";

const ProtectedRoute = ({ children, requiredStep = "login" }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (pathname !== "/login" && pathname !== "/signup" && pathname !== "/") {
          router.push("/login");
        }
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get("/users/profile");
        setUser(data);

        // Flow control logic
        if (requiredStep === "profile" && !data.profileCompleted) {
          router.push("/profile-setup");
        } else if (requiredStep === "resume" && !data.resumeUploaded) {
          router.push("/analysis");
        } else if (pathname === "/login" || pathname === "/signup") {
          // Already logged in, redirect to next step
          if (!data.profileCompleted) router.push("/profile-setup");
          else if (!data.resumeUploaded) router.push("/analysis");
          else router.push("/analysis/result");
        }
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router, requiredStep]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
