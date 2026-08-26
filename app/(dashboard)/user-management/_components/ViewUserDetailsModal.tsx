/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserRowItem } from "./UserManagementTable";
import { Badge } from "@/components/ui/badge";

interface ViewUserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: UserRowItem | null;
}

const renderValue = (key: string, value: any) => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-400 font-normal">N/A</span>;
  }
  
  if (typeof value === "boolean") {
    return value ? (
      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs">Yes</span>
    ) : (
      <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded text-xs">No</span>
    );
  }
  
  if (Array.isArray(value)) {
    const cleanArray = value.filter(v => v);
    if (cleanArray.length === 0) return <span className="text-slate-400 font-normal">None</span>;
    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {cleanArray.map((v, i) => (
          typeof v === 'string' ? (
            <Badge key={i} variant="secondary" className="bg-[#E2E8F0]/70 hover:bg-[#E2E8F0] text-slate-700 font-medium text-[11px] px-2.5 py-0.5 rounded-md shadow-none border-none transition-colors">
              {v}
            </Badge>
          ) : (
            <Badge key={i} variant="secondary" className="bg-[#E2E8F0]/70 hover:bg-[#E2E8F0] text-slate-700 font-medium text-[11px] px-2.5 py-0.5 rounded-md shadow-none border-none transition-colors">
              Object Item
            </Badge>
          )
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    if (value.latitude && value.longitude) {
      return (
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${value.latitude},${value.longitude}`} 
          target="_blank" 
          rel="noreferrer" 
          className="text-blue-600 hover:underline inline-flex items-center font-medium mt-0.5"
        >
          {value.latitude}, {value.longitude}
        </a>
      );
    }
    return <span className="text-slate-400 font-normal italic">Nested Data</span>;
  }

  const strVal = String(value);
  if (strVal.startsWith("http")) {
    const isImage = strVal.match(/\.(jpeg|jpg|gif|png|webp)$/i) || key.toLowerCase().includes('logo') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('picture');
    if (isImage) {
      return (
        <a href={strVal} target="_blank" rel="noreferrer" className="block mt-2">
          <img src={strVal} alt={key} className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-xl border border-slate-200 shadow-xs hover:opacity-90 transition-opacity" />
        </a>
      );
    }
    return (
      <a href={strVal} target="_blank" rel="noreferrer" className="text-[#2C72A9] font-medium hover:underline break-all mt-1 inline-block">
        View Link / Document
      </a>
    );
  }

  return <span className="text-slate-700">{strVal}</span>;
};

// Format camelCase keys to Title Case
const formatKeyName = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function ViewUserDetailsModal({
  open,
  onOpenChange,
  userData,
}: ViewUserDetailsModalProps) {
  if (!userData) return null;

  const { details } = userData;

  // Filter out meta keys
  const filterKeys = ["_id", "userId", "createdAt", "updatedAt", "__v", "profileCompletionStatus", "profileCompletionPercentage"];
  let detailEntries: [string, any][] = [];
  
  if (details && typeof details === "object") {
    detailEntries = Object.entries(details).filter(([key]) => !filterKeys.includes(key));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[850px] w-[94vw] p-0 bg-white rounded-3xl shadow-2xl border-none font-sans overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Sticky Header */}
        <DialogHeader className="p-6 sm:p-8 bg-white border-b border-slate-100 shrink-0 sticky top-0 z-10">
          <DialogTitle className="flex items-center gap-4 m-0">
            <div className="w-12 h-12 rounded-full bg-[#EBF3FA] flex items-center justify-center text-[#2C72A9] font-bold text-xl shadow-inner">
              {userData.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-xl font-bold text-slate-800 leading-none">{userData.name}</span>
              <Badge variant="secondary" className="bg-[#DCEBF6] text-[#2C72A9] font-medium text-[10px] px-2.5 py-0 rounded uppercase tracking-wider">
                {userData.role.replace("_", " ")}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm">
          
          {/* Basic Info Section */}
          <section>
            <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2C72A9]"></span> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Email Address</span>
                <span className="font-semibold text-slate-800">{userData.email || <span className="text-slate-400 font-normal">N/A</span>}</span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Account Status</span>
                <span className="font-semibold capitalize">
                  <Badge variant="outline" className={`border-none shadow-none px-0 text-sm ${userData.status === 'active' ? 'text-green-600' : 'text-amber-600'}`}>
                    {userData.status}
                  </Badge>
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1">Joining Date</span>
                <span className="font-semibold text-slate-800">{userData.joiningDate}</span>
              </div>
            </div>
          </section>

          {/* Dynamic Additional Details */}
          {detailEntries.length > 0 && (
            <section>
              <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Detailed Profile Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8">
                {detailEntries.map(([key, value]) => {
                  // Span 2 columns if it's an array to give badges more room, or if it's a long text
                  const isWide = Array.isArray(value) || (typeof value === 'string' && value.length > 50);
                  
                  return (
                    <div key={key} className={`break-words ${isWide ? 'sm:col-span-2 md:col-span-2' : ''}`}>
                      <span className="block text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
                        {formatKeyName(key)}
                      </span>
                      <div className="font-semibold text-slate-800 text-[13px] leading-snug">
                        {renderValue(key, value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
