"use client";

import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface SubscriptionRevenueItem {
  _id: string;
  amount: number;
  paymentType: string;
  status: "pending" | "completed" | "failed" | "refunded";
  expiryDate?: string;
  createdAt?: string;
  stripePaymentIntentId?: string;
  user?: { fullName?: string; email?: string; role?: string; phoneNumber?: string };
  subscribe?: { planName?: string; price?: number; features?: string[] };
}

interface RevenueDetailsModalProps { open: boolean; onOpenChange: (open: boolean) => void; data: SubscriptionRevenueItem | null; }
const formatDate = (value?: string) => value ? new Date(value).toLocaleDateString() : "Not available";

export default function RevenueDetailsModal({ open, onOpenChange, data }: RevenueDetailsModalProps) {
  if (!data) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="w-[92vw] max-w-[500px] overflow-hidden rounded-3xl border-none bg-white p-8 font-sans shadow-2xl sm:p-9"><button onClick={() => onOpenChange(false)} aria-label="Close revenue details" className="absolute right-6 top-6 p-1 text-slate-500 transition-colors hover:text-slate-800"><X className="h-5 w-5" /></button><div className="space-y-6 pt-1 text-left"><DialogTitle className="text-2xl font-bold text-slate-800">Revenue Management Details</DialogTitle><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Member</span><p className="text-xs font-normal text-slate-400 sm:text-[13px]">{data.user?.fullName || "Not available"}</p><p className="text-xs font-normal text-slate-400">{data.user?.email || "No email available"}</p></div><div className="grid grid-cols-2 items-center gap-4"><div className="space-y-1.5"><span className="block text-xs font-semibold text-slate-700">Payment Status</span><span className={`inline-block rounded-full border px-4 py-1 text-xs font-medium capitalize ${data.status === "completed" ? "border-[#34D399] bg-[#ECFDF5] text-[#059669]" : "border-[#FBBF24] bg-[#FFFBEB] text-[#D97706]"}`}>{data.status}</span></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Expiry Date</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">{formatDate(data.expiryDate)}</p></div></div><div className="grid grid-cols-2 items-center gap-4"><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Amount</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">USD {data.amount}</p></div><div className="space-y-1.5"><span className="block text-xs font-semibold text-slate-700">Plan</span><span className="inline-block rounded-md bg-[#FEF3C7] px-3 py-1 text-[11px] font-medium text-[#D97706]">{data.subscribe?.planName || "Not available"}</span></div></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Membership Features</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">{data.subscribe?.features?.join(", ") || "No features listed"}</p></div><div className="grid grid-cols-2 gap-4"><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Member Role</span><p className="text-xs font-normal capitalize text-slate-600 sm:text-[13px]">{data.user?.role?.replace("_", " ") || "Not available"}</p></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Payment Date</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">{formatDate(data.createdAt)}</p></div></div></div></DialogContent></Dialog>;
}
