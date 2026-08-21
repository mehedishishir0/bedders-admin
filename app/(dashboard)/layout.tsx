import { DashboardSidebar } from "@/components/Sidebar";
import React from "react";
import DashboardHeader from "@/components/DashboardHeader";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col bg-[#F8FAFC]">
        {/* Top Header */}
        <DashboardHeader />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
