"use client";

import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface MarketplaceItem {
  id: string;
  name: string;
  subName?: string;
  companyName: string;
  image: string;
  category: "Medication" | "Gym" | "Docor" | "Instruments" | "Clothes";
  price: string;
  amount?: string;
  expiryDate: string;
}

interface MarketplaceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: MarketplaceItem | null;
}

export default function MarketplaceDetailsModal({
  open,
  onOpenChange,
  data,
}: MarketplaceDetailsModalProps) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[540px] w-[92vw] p-8 bg-white rounded-3xl shadow-2xl border-none font-sans overflow-hidden">
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
              {data.subName || "Vitamin Medicine"}
            </p>
          </div>

          {/* Category & Expiry Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">
                Category
              </span>
              <div>
                <span className="inline-block px-3 py-1 rounded-md text-xs font-medium bg-[#E2E8F0] text-slate-700">
                  {data.category}
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

          {/* Amount Field */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-700 block">Amount</span>
            <p className="text-xs sm:text-[13px] text-slate-600 font-normal">
              {data.amount || "$70"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}