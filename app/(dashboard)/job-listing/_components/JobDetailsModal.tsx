"use client";

import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface JobItem {
  id: string;
  name: string;
  companyType: string;
  logo: string;
  employmentType: "Full-time" | "Part-time";
  title: string;
  location: string;
  experienceLevel: string;
  salary?: string;
  description?: string;
}

interface JobDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobData: JobItem | null;
}

export default function JobDetailsModal({
  open,
  onOpenChange,
  jobData,
}: JobDetailsModalProps) {
  if (!jobData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[620px] w-[92vw] p-8 sm:p-10 bg-white rounded-3xl shadow-2xl border-none font-sans overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6 pt-1 text-left">
          {/* Header Title */}
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Job Details
          </DialogTitle>

          {/* Name Field */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 block">Name</span>
            <p className="text-xs sm:text-[13px] text-slate-400 font-normal">
              {jobData.name}
            </p>
          </div>

          {/* Title & Employment Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">Title</span>
              <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
                {jobData.title}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Employment Type
              </span>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#E2E8F0] text-slate-700">
                  {jobData.employmentType}
                </span>
              </div>
            </div>
          </div>

          {/* Experience Level, Location, Salary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Experience Level
              </span>
              <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
                {jobData.experienceLevel}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">Location</span>
              <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
                {jobData.location}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">Salary</span>
              <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
                {jobData.salary || "£14–£18 per hour"}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-1.5 pt-1">
            <span className="text-xs font-semibold text-[#2B6CB0] block">
              Job Description
            </span>
            <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed">
              {jobData.description ||
                "Describe the role, responsibilities, required qualifications, skills, and any additional information about the position."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}