"use client";

export interface DashboardOverview { totalUsers: number; revenues: number; activeJobs: number; pendingApprovals: number; }
const colors = ["text-[#2B3087]", "text-[#8E44AD]", "text-[#27AE60]", "text-[#D4AC0D]"];

export default function StatsCards({ data, isLoading }: { data?: DashboardOverview; isLoading?: boolean }) {
  const items = [["total_users", "Total Users", data?.totalUsers], ["revenue_month", "Revenue", data?.revenues == null ? undefined : `USD ${data.revenues}`], ["active_jobs", "Active Jobs", data?.activeJobs], ["pending_approvals", "Pending Approvals", data?.pendingApprovals]];
  return <div className="w-full bg-[#F8FAFC] p-6"><div className="mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map(([id, title, value], index) => <div key={id as string} className="flex min-h-[130px] flex-col justify-center rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-md sm:p-7"><p className="mb-2 text-xs font-normal text-slate-500 sm:text-[13px]">{title}</p><h3 className={`text-3xl font-bold tracking-tight sm:text-[32px] ${colors[index]}`}>{isLoading || value === undefined ? "—" : value}</h3></div>)}</div></div>;
}
