"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Logged in successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#f8fbfe]">
      {/* Background Image Container */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-50"
        style={{
          backgroundImage: `url('/authbg.png')`, // Replace with your image path in public folder
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center">
        {/* Header Titles */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e3a5f] tracking-tight mb-2">
            Login To Your Account
          </h1>
          <p className="text-sm md:text-base text-[#64748b]">
            Please enter your email and password to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.05)] border border-[#e2e8f0]/60 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#334155]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full h-11 px-3.5 rounded-lg border border-[#cbd5e1] bg-transparent text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2d6fa8] focus:border-transparent transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#334155]"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full h-11 px-3.5 rounded-lg border border-[#cbd5e1] bg-transparent text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2d6fa8] focus:border-transparent transition-all"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs md:text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#64748b]">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-[#cbd5e1] text-[#2d6fa8] focus:ring-[#2d6fa8] accent-[#2d6fa8] cursor-pointer"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 ${isLoading ? 'bg-[#2d6fa8]/70 cursor-not-allowed' : 'bg-[#2d6fa8] hover:bg-[#255b8a] active:bg-[#1e4a70]'} text-white font-medium rounded-lg text-sm transition-all duration-150 shadow-sm mt-2`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
