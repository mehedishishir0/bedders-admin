"use client";

import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface MarketplaceItem {
  _id: string;
  title: string;
  description?: string;
  category: string;
  price?: number;
  currency?: string;
  city?: string;
  postCode?: string;
  isAvailable?: boolean;
  status: string;
  photos?: string[];
  createdAt?: string;
  sellerUserId?: { fullName?: string; email?: string; role?: string };
}

interface MarketplaceDetailsModalProps { open: boolean; onOpenChange: (open: boolean) => void; data: MarketplaceItem | null; }

export default function MarketplaceDetailsModal({ open, onOpenChange, data }: MarketplaceDetailsModalProps) {
  if (!data) return null;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="w-[92vw] max-w-[540px] overflow-hidden rounded-3xl border-none bg-white p-8 font-sans shadow-2xl"><button onClick={() => onOpenChange(false)} aria-label="Close marketplace details" className="absolute right-6 top-6 p-1 text-slate-500 transition-colors hover:text-slate-800"><X className="h-5 w-5" /></button><div className="space-y-6 pt-1 text-left"><DialogTitle className="text-2xl font-bold text-slate-800">Marketplace Details</DialogTitle><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Name</span><p className="text-xs font-normal text-slate-400 sm:text-[13px]">{data.title}</p></div><div className="grid grid-cols-2 gap-4"><div className="space-y-1.5"><span className="block text-xs font-semibold text-slate-700">Category</span><span className="inline-block rounded-md bg-[#E2E8F0] px-3 py-1 text-xs font-medium text-slate-700">{data.category}</span></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Status</span><p className="text-xs font-normal capitalize text-slate-600 sm:text-[13px]">{data.status.replace("_", " ")}</p></div></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Price</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">{data.price == null ? "N/A" : `${data.currency || "GBP"} ${data.price}`}</p></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Description</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">{data.description || "No description provided."}</p></div><div className="space-y-1"><span className="block text-xs font-semibold text-slate-700">Location</span><p className="text-xs font-normal text-slate-600 sm:text-[13px]">{[data.city, data.postCode].filter(Boolean).join(", ") || "Not provided"}</p></div></div></DialogContent></Dialog>;
}
