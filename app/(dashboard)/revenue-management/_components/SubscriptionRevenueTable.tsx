"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import RevenueDetailsModal, {
  SubscriptionRevenueItem,
} from "./RevenueDetailsModal";

export const initialSubscriptionData: SubscriptionRevenueItem[] = [
  {
    id: "1",
    name: "Leslie Alexander",
    plan: "montly",
    amount: "$70",
    status: "Active",
    expiryDate: "March 13, 2014",
  },
  {
    id: "2",
    name: "Kathryn Murphy",
    plan: "Yearly",
    amount: "$300",
    status: "Pending",
    expiryDate: "February 9, 2015",
  },
  {
    id: "3",
    name: "Ralph Edwards",
    plan: "Monthly",
    amount: "$70",
    status: "Pending",
    expiryDate: "February 11, 2014",
  },
  {
    id: "4",
    name: "Annette Black",
    plan: "Yearly",
    amount: "$300",
    status: "Active",
    expiryDate: "February 11, 2014",
  },
  {
    id: "5",
    name: "Annette Black",
    plan: "Yearly",
    amount: "$300",
    status: "Active",
    expiryDate: "May 6, 2012",
  },
];

export default function SubscriptionRevenueTable() {
  const [items, setItems] =
    useState<SubscriptionRevenueItem[]>(initialSubscriptionData);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("Month");
  const [yearFilter, setYearFilter] = useState("Year");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<SubscriptionRevenueItem | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchMonth =
        monthFilter === "Month" || item.expiryDate.includes(monthFilter);
      const matchYear =
        yearFilter === "Year" || item.expiryDate.includes(yearFilter);

      return matchSearch && matchMonth && matchYear;
    });
  }, [items, searchTerm, monthFilter, yearFilter]);

  const handleApprove = (id: string) => {
    console.log("Approved Subscription ID:", id);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Active" } : item
      )
    );
  };

  const handleReject = (id: string) => {
    console.log("Rejected Subscription ID:", id);
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Pending" } : item
      )
    );
  };

  const handleViewDetails = (item: SubscriptionRevenueItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div >
      <div className="  space-y-6">
        {/* TOP FILTER & SEARCH ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="h-10 pl-10 pr-4 rounded-lg border-slate-200 bg-white text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
            />
          </div>

          {/* Month & Year Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Month Filter */}
            <div className="relative">
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
              >
                <option value="Month">Month</option>
                <option value="March">March</option>
                <option value="February">February</option>
                <option value="May">May</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
              >
                <option value="Year">Year</option>
                <option value="2012">2012</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Blue Table Header */}
              <thead>
                <tr className="bg-[#2B6CB0] text-white text-xs font-semibold">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Plan</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredItems.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Name */}
                    <td className="py-4 px-6 font-medium text-slate-800">
                      {row.name}
                    </td>

                    {/* Plan Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-md text-[11px] font-medium capitalize ${
                          row.plan.toLowerCase() === "montly" ||
                          row.plan.toLowerCase() === "monthly"
                            ? "bg-[#FEF3C7] text-[#D97706]"
                            : "bg-[#F3E8FF] text-[#9333EA]"
                        }`}
                      >
                        {row.plan}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-slate-700 font-normal">
                      {row.amount}
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

                    {/* Expiry Date */}
                    <td className="py-4 px-6 text-slate-600 font-normal">
                      {row.expiryDate}
                    </td>

                    {/* Actions: View + Approve + Reject */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewDetails(row)}
                          title="View Details"
                          className="p-1 text-slate-400 hover:text-[#2B6CB0] transition-colors"
                        >
                          <Eye className="w-4 h-4 text-amber-600/70 hover:text-amber-700" />
                        </button>

                        {/* Approve Button */}
                        <button
                          onClick={() => handleApprove(row.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#2E8540] hover:bg-[#256B33] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Approve
                        </button>

                        {/* Reject Button */}
                        <button
                          onClick={() => handleReject(row.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors shadow-2xs"
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
          <span>Showing 1 to {filteredItems.length} of 12 results</span>

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

      {/* MODAL */}
      <RevenueDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedItem}
      />
    </div>
  );
}