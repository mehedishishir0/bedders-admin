"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ==========================================
// 1. DOMAIN TYPES & DATA DEFINITIONS
// ==========================================
export type UserRole = "Company" | "Agency" | "Supplier" | "Provider" | "Carer";
export type ApprovalStatus = "Pending" | "Approved" | "Rejected";
export type StatusFilterTab = "All" | "Approved" | "Rejected";

export interface ApprovalRecord {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  location: string;
  status: ApprovalStatus;
}

export const initialApprovalData: ApprovalRecord[] = [
  {
    id: "1",
    name: "Care First Limited",
    role: "Company",
    email: "tim.jennings@example.com",
    location: "USA",
    status: "Pending",
  },
  {
    id: "2",
    name: "Care First Limited",
    role: "Agency",
    email: "michelle.rivera@example.com",
    location: "UK",
    status: "Pending",
  },
  {
    id: "3",
    name: "Ralph Edwards",
    role: "Supplier",
    email: "curtis.weaver@example.com",
    location: "France",
    status: "Pending",
  },
  {
    id: "4",
    name: "Annette Black",
    role: "Provider",
    email: "kenzi.lawson@example.com",
    location: "China",
    status: "Pending",
  },
  {
    id: "5",
    name: "Marie Lee",
    role: "Carer",
    email: "michael.mitc@example.com",
    location: "India",
    status: "Pending",
  },
];

const statusTabs: StatusFilterTab[] = ["All", "Approved", "Rejected"];
const locationOptions = ["All Locations", "USA", "UK", "France", "China", "India"];
const roleOptions: ("All Roles" | UserRole)[] = [
  "All Roles",
  "Company",
  "Agency",
  "Supplier",
  "Provider",
  "Carer",
];
const statusDropdownOptions = ["All Status", "Pending", "Approved", "Rejected"];

// ==========================================
// 2. MAIN COMPONENT (ENTERPRISE / PRODUCTION-READY)
// ==========================================
export default function ApprovalsTable() {
  const [data, setData] = useState<ApprovalRecord[]>(initialApprovalData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState<StatusFilterTab>("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedDropdownStatus, setSelectedDropdownStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingRecord, setViewingRecord] = useState<ApprovalRecord | null>(null);

  // Status Mutation Handlers
  const handleApprove = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
  };

  const handleReject = (id: string) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Rejected" } : item
      )
    );
  };

  // Filter Pipeline
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        selectedTab === "All" ? true : item.status === selectedTab;

      const matchesLocation =
        selectedLocation === "All Locations"
          ? true
          : item.location === selectedLocation;

      const matchesRole =
        selectedRole === "All Roles" ? true : item.role === selectedRole;

      const matchesDropdownStatus =
        selectedDropdownStatus === "All Status"
          ? true
          : item.status === selectedDropdownStatus;

      return (
        matchesSearch &&
        matchesTab &&
        matchesLocation &&
        matchesRole &&
        matchesDropdownStatus
      );
    });
  }, [
    data,
    searchTerm,
    selectedTab,
    selectedLocation,
    selectedRole,
    selectedDropdownStatus,
  ]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8 font-sans text-slate-700">
      <div className=" mx-auto space-y-6">

        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left Group: Search Bar & Status Filter Pills */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Search Input Box */}
            <div className="relative w-full sm:w-[320px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-lg text-sm border border-blue-200/90 outline-none focus:ring-2 focus:ring-[#2C72A9]/20 transition-all shadow-xs"
              />
            </div>

            {/* Status Pills */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              {statusTabs.map((tab) => {
                const isActive = selectedTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all border ${
                      isActive
                        ? "bg-[#64A9D9] text-white border-[#64A9D9] shadow-xs"
                        : "bg-transparent text-[#2C72A9] border-blue-200/90 hover:bg-blue-50/50"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Group: Dropdown Selects */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            {/* Location Select */}
            <div className="relative min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors"
              >
                {locationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All Locations" ? "Location" : opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2C72A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Role Select */}
            <div className="relative min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors"
              >
                {roleOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All Roles" ? "Role" : opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2C72A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Status Select */}
            <div className="relative min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={selectedDropdownStatus}
                onChange={(e) => setSelectedDropdownStatus(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors"
              >
                {statusDropdownOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All Status" ? "Status" : opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2C72A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[950px]">
              {/* Solid Ocean Blue Header */}
              <thead>
                <tr className="bg-[#2B73A8] text-white text-xs font-medium">
                  <th className="py-3.5 px-6 text-left w-[20%]">Name</th>
                  <th className="py-3.5 px-6 text-center w-[16%]">Role</th>
                  <th className="py-3.5 px-6 text-center w-[26%]">Email</th>
                  <th className="py-3.5 px-6 text-center w-[14%]">Location</th>
                  <th className="py-3.5 px-6 text-center w-[24%]">Action</th>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-5 px-6 font-medium text-slate-800 text-left">
                        {row.name}
                      </td>

                      {/* Role Pill */}
                      <td className="py-5 px-6 text-center">
                        <Badge
                          variant="secondary"
                          className="bg-[#DCEBF6] hover:bg-[#DCEBF6] text-[#2C72A9] font-medium text-xs px-3.5 py-1 rounded-md shadow-none border-none cursor-default"
                        >
                          {row.role}
                        </Badge>
                      </td>

                      {/* Email */}
                      <td className="py-5 px-6 text-slate-600 text-center font-normal">
                        {row.email}
                      </td>

                      {/* Location */}
                      <td className="py-5 px-6 text-slate-600 text-center font-normal">
                        {row.location}
                      </td>

                      {/* Actions: View / Approve / Reject */}
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center gap-2.5">
                          {/* Eye / View Action */}
                          <button
                            onClick={() => setViewingRecord(row)}
                            title="View Details"
                            className="text-[#B4925A] hover:text-[#937542] transition-colors p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Approve Button */}
                          <Button
                            onClick={() => handleApprove(row.id)}
                            className="h-7 px-4 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-medium shadow-none cursor-pointer transition-colors"
                          >
                            Approve
                          </Button>

                          {/* Reject Button */}
                          <Button
                            onClick={() => handleReject(row.id)}
                            className="h-7 px-4 rounded-full bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium shadow-none cursor-pointer transition-colors"
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      No records found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <p className="text-xs text-slate-400 font-normal">
            Showing 1 to {filteredData.length} of 12 results
          </p>

          <div className="flex items-center gap-1.5">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded text-slate-500 hover:bg-slate-50 text-xs transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Page 1 (Active) */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                currentPage === 1
                  ? "bg-[#2B73A8] text-white border border-[#2B73A8]"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                currentPage === 2
                  ? "bg-[#2B73A8] text-white border border-[#2B73A8]"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                currentPage === 3
                  ? "bg-[#2B73A8] text-white border border-[#2B73A8]"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              3
            </button>

            {/* Ellipsis */}
            <span className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded text-slate-400 text-xs">
              ...
            </span>

            {/* Page 8 */}
            <button
              onClick={() => setCurrentPage(8)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors ${
                currentPage === 8
                  ? "bg-[#2B73A8] text-white border border-[#2B73A8]"
                  : "border border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
            >
              8
            </button>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-7 h-7 flex items-center justify-center border border-slate-300 rounded text-slate-500 hover:bg-slate-50 text-xs transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick View Modal */}
        {viewingRecord && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">
                  User Details
                </h3>
                <button
                  onClick={() => setViewingRecord(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Name:</span>
                  <span className="text-slate-700 font-semibold">{viewingRecord.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Role:</span>
                  <span className="text-slate-700 font-semibold">{viewingRecord.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Email:</span>
                  <span className="text-slate-700 font-semibold">{viewingRecord.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Location:</span>
                  <span className="text-slate-700 font-semibold">{viewingRecord.location}</span>
                </div>
                <div className="flex justify-between py-1 items-center">
                  <span className="text-slate-400 font-medium">Status:</span>
                  <span
                    className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-medium ${
                      viewingRecord.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : viewingRecord.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {viewingRecord.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  onClick={() => {
                    handleApprove(viewingRecord.id);
                    setViewingRecord(null);
                  }}
                  className="h-8 px-4 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white text-xs font-medium"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    handleReject(viewingRecord.id);
                    setViewingRecord(null);
                  }}
                  className="h-8 px-4 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-medium"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}