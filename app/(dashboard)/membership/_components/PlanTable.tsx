"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Eye, ChevronDown, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlanUserItem } from "@/types/types";
import ViewPlanModal from "./ViewPlanModal";
import EditPlanModal from "./EditPlanModal";
import AddPlanModal from "./AddPlanModal";

// Initial Mock Table Data
export const mockTableData: PlanUserItem[] = [
  {
    id: "1",
    plan: "montly",
    user: "Devon Lane",
    role: "Company",
    email: "jennings@example.com",
    expiryDate: "March 13, 2014",
    status: "Active",
    location: "USA",
    title: "Standard Monthly",
    price: "$200",
    features: [
      "Top-tier directory placement",
      "Unlimited everything",
      "Enterprise verification badge",
      "Homepage featured slot",
      "Dedicated account manager",
    ],
  },
  {
    id: "2",
    plan: "Yearly",
    user: "Facebook",
    role: "Agency",
    email: "rivera@example.com",
    expiryDate: "February 9, 2015",
    status: "Inactive",
    location: "UK",
    title: "Agency Yearly",
    price: "$1,800",
    features: [
      "Top-tier directory placement",
      "Unlimited everything",
      "Enterprise verification badge",
      "Homepage featured slot",
    ],
  },
  {
    id: "3",
    plan: "Monthly",
    user: "Gillette",
    role: "Supplier",
    email: "weaver@example.com",
    expiryDate: "February 11, 2014",
    status: "Inactive",
    location: "France",
    title: "Supplier Basic",
    price: "$250",
    features: [
      "Standard directory placement",
      "Dedicated account manager",
    ],
  },
  {
    id: "4",
    plan: "Yearly",
    user: "Darrell Steward",
    role: "Provider",
    email: "lawson@example.com",
    expiryDate: "February 11, 2014",
    status: "Active",
    location: "China",
    title: "Enterprise Provider",
    price: "£149",
    features: [
      "Top-tier directory placement",
      "Unlimited everything",
      "Enterprise verification badge",
      "Homepage featured slot",
      "Dedicated account manager",
    ],
  },
  {
    id: "5",
    plan: "Yearly",
    user: "Jerome Bell",
    role: "Carer",
    email: "mitc@example.com",
    expiryDate: "May 6, 2012",
    status: "Active",
    location: "India",
    title: "Carer Yearly Pass",
    price: "$399",
    features: [
      "Top-tier directory placement",
      "Unlimited everything",
      "Homepage featured slot",
    ],
  },
];

export default function PlanTableSection() {
  const [data, setData] = useState<PlanUserItem[]>(mockTableData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activePlanFilter, setActivePlanFilter] = useState<"All" | "Monthly" | "Yearly">("All");

  // Dropdown filter states
  const [roleFilter, setRoleFilter] = useState("Role");
  const [locationFilter, setLocationFilter] = useState("Location");
  const [statusFilter, setStatusFilter] = useState("Status");

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanUserItem | null>(null);

  // Filtered List
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchPlan =
        activePlanFilter === "All" ||
        (activePlanFilter === "Monthly" &&
          (item.plan === "montly" || item.plan === "Monthly")) ||
        (activePlanFilter === "Yearly" && item.plan === "Yearly");

      const matchRole = roleFilter === "Role" || item.role === roleFilter;
      const matchLocation = locationFilter === "Location" || item.location === locationFilter;
      const matchStatus = statusFilter === "Status" || item.status === statusFilter;

      return matchSearch && matchPlan && matchRole && matchLocation && matchStatus;
    });
  }, [data, searchTerm, activePlanFilter, roleFilter, locationFilter, statusFilter]);

  const handleApprove = (id: string) => {
    console.log("Approved item ID:", id);
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Active" } : item))
    );
  };

  const handleReject = (id: string) => {
    console.log("Rejected item ID:", id);
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Inactive" } : item))
    );
  };

  const openView = (item: PlanUserItem) => {
    setSelectedPlan(item);
    setIsViewOpen(true);
  };

  const openEdit = (item: PlanUserItem) => {
    setSelectedPlan(item);
    setIsEditOpen(true);
  };

  return (
    <div className="">
      <div className=" mx-auto space-y-6">
        
        {/* TOP FILTER & ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Search & Segmented Plan Filter */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Search Input */}
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="h-10 pl-10 pr-4 rounded-lg border-slate-200 bg-white text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
              />
            </div>

            {/* Pill Filters: All, Monthly, Yearly */}
            <div className="flex items-center gap-1.5">
              {(["All", "Monthly", "Yearly"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivePlanFilter(type)}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all ${
                    activePlanFilter === type
                      ? "bg-[#6BA4D9] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Dropdowns & Add Plan Button */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Role Filter */}
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
              >
                <option value="Role">Role</option>
                <option value="Company">Company</option>
                <option value="Agency">Agency</option>
                <option value="Supplier">Supplier</option>
                <option value="Provider">Provider</option>
                <option value="Carer">Carer</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
              >
                <option value="Location">Location</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="France">France</option>
                <option value="China">China</option>
                <option value="India">India</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
              >
                <option value="Status">Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Add Plan Button */}
            <Button
              onClick={() => setIsAddOpen(true)}
              className="h-10 px-5 rounded-lg bg-[#2B6CB0] hover:bg-[#235891] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs border-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Plan</span>
            </Button>
          </div>

        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Table Header Row */}
              <thead>
                <tr className="bg-[#2B6CB0] text-white text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body Rows */}
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Plan Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-[11px] font-medium capitalize ${
                          row.plan.toLowerCase() === "montly" || row.plan.toLowerCase() === "monthly"
                            ? "bg-[#FEF3C7] text-[#D97706]"
                            : "bg-[#F3E8FF] text-[#9333EA]"
                        }`}
                      >
                        {row.plan}
                      </span>
                    </td>

                    {/* User */}
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {row.user}
                    </td>

                    {/* Role Pill */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-[#E2E8F0] text-slate-700">
                        {row.role}
                      </span>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-500 font-normal">
                      {row.email}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-4 px-6 text-slate-600 font-normal">
                      {row.expiryDate}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-4 py-1 rounded-full text-xs font-medium border ${
                          row.status === "Active"
                            ? "border-[#34D399] text-[#059669] bg-[#ECFDF5]"
                            : "border-[#FBBF24] text-[#D97706] bg-[#FFFBEB]"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {row.location}
                    </td>

                    {/* Action Buttons: View, Edit, Approve, Reject */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Icon */}
                        <button
                          onClick={() => openView(row)}
                          title="View Plan"
                          className="p-1.5 text-slate-400 hover:text-[#2B6CB0] transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Icon */}
                        <button
                          onClick={() => openEdit(row)}
                          title="Edit Plan"
                          className="p-1.5 text-slate-400 hover:text-[#2B6CB0] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Approve Button */}
                        <button
                          onClick={() => handleApprove(row.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#2E8540] hover:bg-[#256B33] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Approve
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleReject(row.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Reject
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-normal">
          <span>Showing 1 to {filteredData.length} of 12 results</span>

          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2B6CB0] text-white font-semibold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50">
              8
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* MODAL COMPONENTS */}
      <AddPlanModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmitSuccess={(newPlan) => {
          console.log("Newly Added Plan Hook Data:", newPlan);
        }}
      />

      <EditPlanModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        planData={selectedPlan}
        onSubmitSuccess={(updatedPlan) => {
          console.log("Updated Plan Hook Data:", updatedPlan);
        }}
      />

      <ViewPlanModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        planData={selectedPlan}
      />
    </div>
  );
}