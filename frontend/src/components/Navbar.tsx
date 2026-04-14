"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/Button";

import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Gap Analysis", href: "/analysis" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 sm:p-10 pointer-events-none">
      <div className="w-full max-w-7xl flex items-center justify-between px-8 py-5 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] pointer-events-auto transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06)]">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[#4A90E2] to-[#3B82F6] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(74,144,226,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <span className="text-2xl font-black italic tracking-tighter">Y</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-display">
            Yogyata
          </span>
        </Link>

        {/* Nav Items - Desktop */}
        <div className="hidden md:flex items-center gap-12 font-bold tracking-tight">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-all duration-300 relative group/item ${
                  isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#4A90E2] transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover/item:w-full"
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-5">
          <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </Link>
          <Link href="/profile-setup" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Profile
          </Link>
          <Link href="/signup">
            <Button className="!px-7 !py-3 !rounded-[20px] text-sm !font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
