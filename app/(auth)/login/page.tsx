"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
        setIsLoading(false);
        return;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center bg-[#fafafa] overflow-hidden">
      {/* Background Watermark Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "url('/logo.svg')",
          backgroundSize: "300px",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
          transform: "rotate(-15deg) scale(1.5)",
        }}
      />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50">
        <div className="flex flex-col items-center mb-8 text-center">
          <h1 className="text-[26px] font-bold text-[#2d3748] mb-2 tracking-tight">Login To Your Account</h1>
          <p className="text-[#718096] text-sm">Please enter your email and password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-semibold text-[#4a5568]">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              className="h-12 border-gray-200 placeholder:text-gray-400 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-semibold text-[#4a5568]">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="h-12 border-gray-200 placeholder:text-gray-400 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="rounded-[4px] border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
              <label
                htmlFor="remember"
                className="text-xs text-[#718096] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#3182ce] hover:text-blue-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#2b6cb0] hover:bg-[#2c5282] text-white font-medium rounded-lg text-sm mt-2 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-[#718096]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#3182ce] font-medium hover:underline">
            Sign Up Here
          </Link>
        </div>
      </div>
    </div>
  );
}
