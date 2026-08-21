"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// ==========================================
// 1. DATA TYPES & STATIC JSON
// ==========================================
export type UserRole = "Company" | "Agency" | "Supplier" | "Provider" | "Carer";
export type UserStatus = "Active" | "Suspended";

export interface UserRowItem {
  id: string;
  name: string;
  role: UserRole;
  joiningDate: string;
  location: string;
  status: UserStatus;
}

export const initialUsersData: UserRowItem[] = [
  {
    id: "1",
    name: "Leslie Alexander",
    role: "Company",
    joiningDate: "March 13, 2014",
    location: "USA",
    status: "Active",
  },
  {
    id: "2",
    name: "Kathryn Murphy",
    role: "Agency",
    joiningDate: "February 9, 2015",
    location: "UK",
    status: "Suspended",
  },
  {
    id: "3",
    name: "Ralph Edwards",
    role: "Supplier",
    joiningDate: "February 11, 2014",
    location: "France",
    status: "Suspended",
  },
  {
    id: "4",
    name: "Annette Black",
    role: "Provider",
    joiningDate: "February 11, 2014",
    location: "France",
    status: "Active",
  },
  {
    id: "5",
    name: "Annette Black",
    role: "Carer",
    joiningDate: "May 6, 2012",
    location: "India",
    status: "Active",
  },
];

const locationFilterOptions = ["All Locations", "USA", "UK", "France", "India"];
const roleFilterOptions: ("All Roles" | UserRole)[] = [
  "All Roles",
  "Company",
  "Agency",
  "Supplier",
  "Provider",
  "Carer",
];
const statusFilterOptions: ("All Status" | UserStatus)[] = [
  "All Status",
  "Active",
  "Suspended",
];

// ==========================================
// 2. MAIN DATA TABLE COMPONENT
// ==========================================
export default function UserManagementTable() {
  const [users, setUsers] = useState<UserRowItem[]>(initialUsersData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === "All Locations" ||
        user.location === selectedLocation;

      const matchesRole =
        selectedRole === "All Roles" || user.role === selectedRole;

      const matchesStatus =
        selectedStatus === "All Status" || user.status === selectedStatus;

      return matchesSearch && matchesLocation && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedLocation, selectedRole, selectedStatus]);

  // Delete Action Handler
  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8 font-sans text-slate-700">
      <div className=" mx-auto space-y-6">
        
        {/* Top Control Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Input Box */}
          <div className="relative w-full lg:w-[340px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-lg text-sm border border-blue-200/90 outline-none focus:ring-2 focus:ring-[#2C72A9]/20 transition-all shadow-xs"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Location Select */}
            <div className="relative min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors"
              >
                {locationFilterOptions.map((opt) => (
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
                {roleFilterOptions.map((opt) => (
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors"
              >
                {statusFilterOptions.map((opt) => (
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
              {/* Solid Blue Table Header */}
              <thead>
                <tr className="bg-[#2B73A8] text-white text-xs font-medium">
                  <th className="py-3.5 px-6 text-left w-[20%]">Name</th>
                  <th className="py-3.5 px-6 text-center w-[16%]">Role</th>
                  <th className="py-3.5 px-6 text-center w-[20%]">Joining Date</th>
                  <th className="py-3.5 px-6 text-center w-[14%]">Location</th>
                  <th className="py-3.5 px-6 text-center w-[16%]">Status</th>
                  <th className="py-3.5 px-6 text-center w-[14%]">Action</th>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-5 px-6 font-medium text-slate-800 text-left">
                        {user.name}
                      </td>

                      {/* Role Pill */}
                      <td className="py-5 px-6 text-center">
                        <Badge
                          variant="secondary"
                          className="bg-[#DCEBF6] hover:bg-[#DCEBF6] text-[#2C72A9] font-medium text-xs px-3.5 py-1 rounded-md shadow-none border-none cursor-default"
                        >
                          {user.role}
                        </Badge>
                      </td>

                      {/* Joining Date */}
                      <td className="py-5 px-6 text-slate-600 text-center font-normal">
                        {user.joiningDate}
                      </td>

                      {/* Location */}
                      <td className="py-5 px-6 text-slate-600 text-center font-normal">
                        {user.location}
                      </td>

                      {/* Status Outlined Badge */}
                      <td className="py-5 px-6 text-center">
                        <span
                          className={`inline-block px-5 py-1 rounded-full text-xs font-normal border ${
                            user.status === "Active"
                              ? "border-[#4ADE80] text-[#16A34A] bg-[#F0FDF4]/30"
                              : "border-[#FBBF24] text-[#D97706] bg-[#FFFBEB]/30"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Action Icons */}
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleDelete(user.id)}
                            title="Delete"
                            className="text-[#DC2626] hover:text-[#B91C1C] transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            title="View Profile"
                            className="text-[#B4925A] hover:text-[#937542] transition-colors p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-slate-400 text-xs"
                    >
                      No records found.
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
            Showing 1 to {filteredUsers.length} of 12 results
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

      </div>
    </div>
  );
}