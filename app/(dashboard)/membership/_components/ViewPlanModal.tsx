"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PlanUserItem } from "@/types/types";

interface ViewPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planData?: PlanUserItem | null;
}

export default function ViewPlanModal({
  open,
  onOpenChange,
  planData,
}: ViewPlanModalProps) {
  const title = planData?.title || "Enterprise";
  const subtext = "Billed monthly, cancel anytime";
  const price = planData?.price || "£149";
  const billingCycle = "/month";
  const features = planData?.features || [
    "Top-tier directory placement",
    "Unlimited everything",
    "Enterprise verification badge",
    "Homepage featured slot",
    "Dedicated account manager",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[92vw] p-8 sm:p-10 bg-white rounded-3xl shadow-2xl border-none font-sans overflow-hidden">
        {/* Close Button Top Right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-6 top-6 text-slate-500 hover:text-slate-800 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="space-y-6 pt-2 text-left">
          {/* Title & Subtext */}
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </DialogTitle>
            <p className="text-xs text-slate-400 font-normal">
              {subtext}
            </p>
          </div>

          {/* Pricing Header */}
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#2575FC] tracking-tight">
              {price}
            </span>
            <span className="text-sm font-semibold text-[#2575FC]">
              {billingCycle}
            </span>
          </div>

          {/* Features Checkmark List */}
          <div className="space-y-3 pt-2">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#2E8540] fill-[#2E8540]/20 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-slate-700">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}