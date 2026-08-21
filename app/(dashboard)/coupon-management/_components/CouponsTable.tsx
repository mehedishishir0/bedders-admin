"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateCouponModal, { CouponFormValues } from "./CreateCouponModal";

export interface CouponItem {
  id: string;
  code: string;
  name: string;
  discountValue: string;
  eligibleUsers: string;
  usedCount: number;
  totalLimit: number;
  expiryDate: string;
  status: "Active" | "Scheduled" | "Expired";
}

export const initialCouponsData: CouponItem[] = [
  {
    id: "1",
    code: "SUMMER25",
    name: "Summer Sale 2026",
    discountValue: "25%",
    eligibleUsers: "All Users",
    usedCount: 1842,
    totalLimit: 5000,
    expiryDate: "2026-08-31",
    status: "Active",
  },
  {
    id: "2",
    code: "WINTER15",
    name: "Winter Clearance 2026",
    discountValue: "15%",
    eligibleUsers: "New Customers",
    usedCount: 1250,
    totalLimit: 3000,
    expiryDate: "2026-12-15",
    status: "Scheduled",
  },
  {
    id: "3",
    code: "FALL20",
    name: "Autumn Special 2026",
    discountValue: "20%",
    eligibleUsers: "Selected Items",
    usedCount: 900,
    totalLimit: 1000,
    expiryDate: "2026-10-10",
    status: "Expired",
  },
];

export default function CouponsTable() {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCouponsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Scheduled" | "Expired">("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eligibleUsers.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    console.log("Deleted Coupon ID:", id);
    setCoupons((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateCoupon = (data: CouponFormValues) => {
    const newCoupon: CouponItem = {
      id: String(Date.now()),
      code: data.couponCode,
      name: data.couponName,
      discountValue: data.discountValue,
      eligibleUsers: data.validityTarget,
      usedCount: 0,
      totalLimit: 1000,
      expiryDate: data.expiryDate,
      status: "Active",
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  return (
    <div>
      <div className=" space-y-6">
        
        {/* TOP CONTROLS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Status Filter Pills */}
          <div className="flex items-center gap-2">
            {(["All", "Active", "Scheduled", "Expired"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-1.5 text-xs rounded-full font-medium transition-all ${
                  statusFilter === tab
                    ? "bg-[#6BA4D9] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input & New Coupon CTA */}
          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="h-10 pl-10 pr-4 rounded-lg border-slate-200 bg-white text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
              />
            </div>

            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-5 rounded-lg bg-[#2B6CB0] hover:bg-[#235891] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs border-none"
            >
              <Plus className="w-4 h-4" />
              <span>New Coupon</span>
            </Button>
          </div>

        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Blue Header */}
              <thead>
                <tr className="bg-[#2B6CB0] text-white text-xs font-semibold">
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-6">Value</th>
                  <th className="py-4 px-6">Eligible Users</th>
                  <th className="py-4 px-6">Usage</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredCoupons.map((row) => {
                  const percentage = Math.min(
                    100,
                    Math.round((row.usedCount / row.totalLimit) * 100)
                  );

                  return (
                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Coupon Code & Campaign Name */}
                      <td className="py-4 px-6">
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {row.code}
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {row.name}
                          </span>
                        </div>
                      </td>

                      {/* Value */}
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {row.discountValue}
                      </td>

                      {/* Eligible Users */}
                      <td className="py-4 px-6 text-slate-600 font-normal">
                        {row.eligibleUsers}
                      </td>

                      {/* Usage Progress Bar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-[#EF4444] rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {row.usedCount}/{row.totalLimit}
                          </span>
                        </div>
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-6 text-slate-600 font-normal">
                        {row.expiryDate}
                      </td>

                      {/* Status Pill */}
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-3.5 py-1 rounded-full text-xs font-medium ${
                            row.status === "Active"
                              ? "text-[#059669] bg-[#ECFDF5]"
                              : row.status === "Scheduled"
                              ? "text-[#D97706] bg-[#FEF3C7]"
                              : "text-[#DC2626] bg-[#FEE2E2]"
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>

                      {/* Delete Action Button */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE COUPON MODAL */}
      <CreateCouponModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmitSuccess={handleCreateCoupon}
      />
    </div>
  );
}