/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Info, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ==========================================
// 1. DUMMY JSON DATA
// ==========================================
export const initialRevenueData = {
  title: "Revenue",
  selectedPeriod: "June, 2026",
  chartData: [
    { month: "Jan", revenue: 50, formattedRevenue: "$850" },
    { month: "Feb", revenue: 185, formattedRevenue: "$3,145" },
    { month: "Mar", revenue: 135, formattedRevenue: "$2,295" },
    { month: "Apr", revenue: 95, formattedRevenue: "$1,615" },
    { month: "May", revenue: 290, formattedRevenue: "$4,930" },
    { month: "June", revenue: 510, formattedRevenue: "$8,820" },
    { month: "July", revenue: 420, formattedRevenue: "$7,140" },
    { month: "Aug", revenue: 400, formattedRevenue: "$6,800" },
    { month: "Sep", revenue: 640, formattedRevenue: "$10,880" },
    { month: "Oct", revenue: 460, formattedRevenue: "$7,820" },
    { month: "Nov", revenue: 270, formattedRevenue: "$4,590" },
  ],
};

export interface RevenueChartDataProps {
  data?: typeof initialRevenueData;
}

// ==========================================
// 2. DYNAMIC TOOLTIP COMPONENT
// ==========================================
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const itemData = payload[0].payload;
    return (
      <div className="flex flex-col items-center pointer-events-none -translate-y-28">
        {/* Floating Tooltip Card */}
        <div className="bg-popover text-popover-foreground rounded-2xl px-5 py-3 shadow-[0_8px_25px_rgba(0,0,0,0.12)] border border-border text-center relative z-20">
          <p className="text-[10px] text-muted-foreground font-medium leading-none">
            This Month
          </p>
          <p className="text-base font-bold text-foreground my-1 leading-tight">
            {itemData.formattedRevenue || `$${itemData.revenue * 17}`}
          </p>
          <p className="text-[10px] text-muted-foreground font-medium leading-none">
            {label}
          </p>

          {/* Downward triangle indicator */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-popover rotate-45 border-r border-b border-border" />
        </div>

        {/* Dotted indicator line */}
        <div className="w-[1.5px] h-[130px] border-l-2 border-dashed border-[#2A7D6F] mt-2.5" />
      </div>
    );
  }
  return null;
};

export default function RevenueChartCard({
  data = initialRevenueData,
}: RevenueChartDataProps) {
  return (
  <div className="px-6">
      <Card className="rounded-2xl  bg-card p-6 md:p-8 shadow-xs font-sans">
      {/* Header */}
      <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0 mb-8">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base md:text-lg font-bold text-[#2A7D6F]">
            {data.title}
          </CardTitle>
          <Info className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>

        {/* Shadcn Badge */}
        <Badge
          variant="outline"
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground font-normal bg-background hover:bg-accent cursor-pointer transition-colors"
        >
          <span>{data.selectedPeriod}</span>
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
        </Badge>
      </CardHeader>

      {/* Chart Section */}
      <CardContent className="p-0">
        <div className="w-full h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data.chartData}
              margin={{ top: 80, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A8AF4" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#4A8AF4" stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                dy={12}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                ticks={[0, 250, 500, 750]}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "transparent" }}
                isAnimationActive={true}
              />

              <Area
                type="natural"
                dataKey="revenue"
                stroke="#2A7D6F"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#chartGradient)"
                activeDot={{
                  r: 6,
                  fill: "#2A7D6F",
                  stroke: "#ffffff",
                  strokeWidth: 2.5,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </div>
  );
}