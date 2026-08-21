"use client";

import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface SubscriptionRevenueItem {
  id: string;
  name: string;
  plan: "montly" | "Monthly" | "Yearly";
  amount: string;
  status: "Active" | "Pending";
  expiryDate: string;
}

interface RevenueDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SubscriptionRevenueItem | null;
}

export default function RevenueDetailsModal({
  open,
  onOpenChange,
  data,
}: RevenueDetailsModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] w-[92vw] p-8 sm:p-9 bg-white rounded-3xl shadow-2xl border-none font-sans overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6 pt-1 text-left">
          {/* Header Title */}
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Revenue management Details
          </DialogTitle>

          {/* Name Field */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 block">Name</span>
            <p className="text-xs sm:text-[13px] text-slate-400 font-normal">
              {data.name}
            </p>
          </div>

          {/* Status & Expiry Date Row */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">
                Status
              </span>
              <div>
                <span
                  className={`inline-block px-4 py-1 rounded-full text-xs font-medium border ${
                    data.status === "Active"
                      ? "border-[#34D399] text-[#059669] bg-[#ECFDF5]"
                      : "border-[#FBBF24] text-[#D97706] bg-[#FFFBEB]"
                  }`}
                >
                  {data.status}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Expiry Date
              </span>
              <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
                {data.expiryDate}
              </p>
            </div>
          </div>

          {/* Amount & Plan Row */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Amount
              </span>
              <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
                {data.amount}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">
                Plan
              </span>
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-md text-[11px] font-medium capitalize ${
                    data.plan.toLowerCase() === "montly" ||
                    data.plan.toLowerCase() === "monthly"
                      ? "bg-[#FEF3C7] text-[#D97706]"
                      : "bg-[#F3E8FF] text-[#9333EA]"
                  }`}
                >
                  {data.plan}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}