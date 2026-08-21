"use client";

import React from "react";

// ==========================================
// 1. JSON DATA CONFIGURATION
// ==========================================
export const statsData = [
  {
    id: "total_users",
    title: "Total Users",
    value: "1,160",
    color: "text-[#2B3087]", // Deep Navy Blue
  },
  {
    id: "revenue_month",
    title: "Revenue (month)",
    value: "$8,820",
    color: "text-[#8E44AD]", // Purple
  },
  {
    id: "active_jobs",
    title: "Active Jobs",
    value: "220",
    color: "text-[#27AE60]", // Forest Green
  },
  {
    id: "pending_approvals",
    title: "Pending Approvals",
    value: "16",
    color: "text-[#D4AC0D]", // Golden Ochre
  },
];

export interface StatItem {
  id: string;
  title: string;
  value: string;
  color: string;
}

interface StatsCardsProps {
  data?: StatItem[];
}


export default function StatsCards({ data = statsData }: StatsCardsProps) {
  return (
    <div className="w-full bg-[#F8FAFC] p-6">
      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-center min-h-[130px] transition-shadow hover:shadow-md"
          >
            <p className="text-xs sm:text-[13px] text-slate-500 font-normal mb-2">
              {item.title}
            </p>
            <h3 className={`text-3xl sm:text-[32px] font-bold tracking-tight ${item.color}`}>
              {item.value}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}