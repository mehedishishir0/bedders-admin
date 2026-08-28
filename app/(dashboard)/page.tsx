"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import StatsCards, { DashboardOverview } from "./_components/StatsCards";
import RevenueChartCard, { RevenueChartResponse } from "./_components/RevenueChartCard";
import ApprovalsAndJobListings, { DashboardApproval, DashboardJob } from "./_components/ApprovalsAndJobListings";

type ListResponse<T> = { data: T[]; meta: { page: number; limit: number; total: number } };
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-home"],
    queryFn: async () => {
      const headers = { Authorization: `Bearer ${session?.user?.accessToken || ""}` };
      const [overviewResponse, chartResponse, approvalsResponse, jobsResponse] = await Promise.all([fetch(`${backendUrl}/dashboard/overview`, { headers }), fetch(`${backendUrl}/dashboard/chart`, { headers }), fetch(`${backendUrl}/dashboard/approvals?limit=10`, { headers }), fetch(`${backendUrl}/dashboard/jobs?limit=10`, { headers })]);
      const [overview, chart, approvals, jobs] = await Promise.all([overviewResponse.json().catch(() => ({})), chartResponse.json().catch(() => ({})), approvalsResponse.json().catch(() => ({})), jobsResponse.json().catch(() => ({}))]);
      const failedResponse = [overviewResponse, chartResponse, approvalsResponse, jobsResponse].find((response) => !response.ok);
      if (failedResponse) throw new Error("Failed to load dashboard data");
      return { overview: overview.data as DashboardOverview, chart: chart.data as RevenueChartResponse, approvals: approvals as ListResponse<DashboardApproval>, jobs: jobs as ListResponse<DashboardJob> };
    },
    enabled: !!session?.user?.accessToken,
  });
  return <div><StatsCards data={data?.overview} isLoading={isLoading} /><RevenueChartCard data={data?.chart} isLoading={isLoading} /><ApprovalsAndJobListings approvals={data?.approvals.data || []} jobs={data?.jobs.data || []} isLoading={isLoading} /></div>;
}
