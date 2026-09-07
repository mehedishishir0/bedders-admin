import React from "react";
import Link from "next/link";
import { LayoutGrid, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "404 - Page Not Found | Bedders Admin",
};

export default function AdminNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
          <AlertCircle className="h-8 w-8" />
        </div>

        <h1 className="text-4xl font-extrabold text-[#3B386E]">404</h1>
        <h2 className="mt-2 text-lg font-bold text-slate-800">Page Not Found</h2>
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          The admin dashboard page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link href="/">
            <Button className="w-full bg-[#2A6592] hover:bg-[#1f4c70] text-white flex items-center justify-center gap-2 cursor-pointer">
              <LayoutGrid className="w-4 h-4" />
              Return to Dashboard Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
