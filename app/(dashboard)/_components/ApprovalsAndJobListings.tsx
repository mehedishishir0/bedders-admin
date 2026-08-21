"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ==========================================
// 1. DUMMY JSON DATA CONFIGURATION
// ==========================================
export const initialDashboardListsData = {
  pendingApprovals: {
    title: "Pending Approvals",
    viewAllLink: "#",
    items: [
      {
        id: "pa-1",
        name: "Care First Limited",
        subtitle: "Care Company - London",
        iconType: "vw",
      },
      {
        id: "pa-2",
        name: "Care First Limited",
        subtitle: "Care Company - London",
        iconType: "vw",
      },
      {
        id: "pa-3",
        name: "Care First Limited",
        subtitle: "Care Company - London",
        iconType: "vw",
      },
    ],
  },
  jobListings: {
    title: "Job Listings",
    viewAllLink: "#",
    items: [
      {
        id: "jl-1",
        name: "Care First Limited",
        subtitle: "Care Company - Nurse",
        iconType: "tesla",
      },
      {
        id: "jl-2",
        name: "Care First Limited",
        subtitle: "Care Company - Nurse",
        iconType: "tesla",
      },
      {
        id: "jl-3",
        name: "Care First Limited",
        subtitle: "Care Company - Nurse",
        iconType: "tesla",
      },
    ],
  },
};

export type DashboardListsDataType = typeof initialDashboardListsData;

// ==========================================
// 2. BRAND ICONS
// ==========================================
const BrandLogo = ({ type }: { type: string }) => {
  if (type === "tesla") {
    return (
      <div className="w-10 h-10 rounded-lg bg-[#061325] flex items-center justify-center text-white shrink-0 shadow-xs">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 5.5c3.3 0 6.5-1 6.5-1s-1.3 2.3-6.5 2.3S5.5 4.5 5.5 4.5 8.7 5.5 12 5.5zm0 2.2c-2.8 0-5 .7-5 .7l1.7 10.6h2l.8-6h1l.8 6h2l1.7-10.6s-2.2-.7-5-.7z" />
        </svg>
      </div>
    );
  }

  // VW Icon
  return (
    <div className="w-10 h-10 rounded-lg bg-[#0F2D4A] flex items-center justify-center text-white shrink-0 shadow-xs">
      <svg
        className="w-6 h-6 stroke-current"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9.5" />
        <path d="M7.5 8.5L10 16.5L12 11L14 16.5L16.5 8.5" />
        <path d="M8.8 8.5L12 15L15.2 8.5" />
      </svg>
    </div>
  );
};

// ==========================================
// 3. MAIN APPROVALS & LISTINGS COMPONENT
// ==========================================
export default function ApprovalsAndJobListings({
  data = initialDashboardListsData,
}: {
  data?: DashboardListsDataType;
}) {
  const [approvals, setApprovals] = useState(data.pendingApprovals.items);
  const [jobs, setJobs] = useState(data.jobListings.items);

  const handleApprovePending = (id: string) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRejectPending = (id: string) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApproveJob = (id: string) => {
    setJobs((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRejectJob = (id: string) => {
    setJobs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full bg-[#F8FAFC] p-4 sm:p-6 font-sans">
      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT CARD: PENDING APPROVALS */}
        <Card className="rounded-2xl border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-[#3B386E]">
              {data.pendingApprovals.title}
            </CardTitle>
            <a
              href={data.pendingApprovals.viewAllLink}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              View all
            </a>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100">
            {approvals.map((item) => (
              <div
                key={item.id}
                className="py-3.5 first:pt-2 last:pb-1 flex items-center justify-between gap-3"
              >
                {/* Left side: Icon + Titles */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <BrandLogo type={item.iconType} />
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-normal mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => handleApprovePending(item.id)}
                    className="h-8 px-4 sm:px-5 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-medium shadow-none cursor-pointer transition-colors"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectPending(item.id)}
                    className="h-8 px-4 sm:px-5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium shadow-none cursor-pointer transition-colors"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}

            {approvals.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending approvals remaining.
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT CARD: JOB LISTINGS */}
        <Card className="rounded-2xl border-slate-200/80 bg-white p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-bold text-[#3B386E]">
              {data.jobListings.title}
            </CardTitle>
            <a
              href={data.jobListings.viewAllLink}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
            >
              View all
            </a>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100">
            {jobs.map((item) => (
              <div
                key={item.id}
                className="py-3.5 first:pt-2 last:pb-1 flex items-center justify-between gap-3"
              >
                {/* Left side: Icon + Titles */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <BrandLogo type={item.iconType} />
                  <div className="truncate">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 font-normal mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => handleApproveJob(item.id)}
                    className="h-8 px-4 sm:px-5 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-medium shadow-none cursor-pointer transition-colors"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRejectJob(item.id)}
                    className="h-8 px-4 sm:px-5 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium shadow-none cursor-pointer transition-colors"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}

            {jobs.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No job listings remaining.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}