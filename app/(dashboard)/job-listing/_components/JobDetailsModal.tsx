"use client";

import React from "react";
import { X, MapPin, Briefcase, PoundSterling, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface JobDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobData: any; // using any to quickly match API response
}

export default function JobDetailsModal({
  open,
  onOpenChange,
  jobData,
}: JobDetailsModalProps) {
  if (!jobData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[95vw] p-0 bg-white rounded-2xl shadow-xl border-none font-sans overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-50 border-b border-slate-100 p-6 sm:p-8 relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-6 top-6 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-sm">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {jobData.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold capitalize ${
                    jobData.status === 'approved' ? 'bg-green-100 text-green-700' :
                    jobData.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
                    jobData.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-slate-200 text-slate-700'
                }`}>
                  {jobData.status?.replace('_', ' ')}
                </span>
                <span className="text-[13px] text-slate-500 font-medium">
                  {jobData.organizationUserId?.email || 'N/A'}
                </span>
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">Job Details for {jobData.title}</DialogDescription>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Job Type</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-800 capitalize">{jobData.jobType?.replace('_', ' ')}</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">{jobData.location || jobData.city}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <PoundSterling className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Salary</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">
                {jobData.salaryMin} - {jobData.salaryMax} {jobData.salaryCurrency}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Experience</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-800">{jobData.requiredExperience} years</p>
            </div>
          </div>

          {/* Rejection Reason Banner */}
          {(jobData.rejectionReason || jobData.reason || jobData.status === 'rejected') && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 text-red-800">
              <h4 className="text-sm font-bold flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Rejection Reason
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-red-700 font-medium">
                {jobData.rejectionReason || jobData.reason || "No specific reason provided."}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
              Job Description
            </h4>
            <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">
              {jobData.description}
            </p>
          </div>

          {/* Skills & Requirements Grid */}
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Required Skills */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                Required Skills
              </h4>
              <ul className="space-y-2">
                {jobData.requiredSkills?.map((skill: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-600 capitalize">{skill}</span>
                  </li>
                ))}
                {(!jobData.requiredSkills || jobData.requiredSkills.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No specific skills listed.</p>
                )}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                Other Requirements
              </h4>
              <ul className="space-y-2">
                {jobData.requirements?.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-600 capitalize">{req}</span>
                  </li>
                ))}
                {(!jobData.requirements || jobData.requirements.length === 0) && (
                  <p className="text-xs text-slate-400 italic">No specific requirements listed.</p>
                )}
              </ul>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
             <div className="flex items-center gap-1.5">
               <span>Posted on:</span>
               <span className="font-medium text-slate-600">{new Date(jobData.createdAt).toLocaleDateString()}</span>
             </div>
             <div className="flex items-center gap-1.5">
               <span>Closes on:</span>
               <span className="font-medium text-slate-600">{new Date(jobData.closesAt).toLocaleDateString()}</span>
             </div>
             <div className="flex items-center gap-1.5">
               <span>Post Code:</span>
               <span className="font-medium text-slate-600">{jobData.postCode}</span>
             </div>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  );
}