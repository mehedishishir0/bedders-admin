"use client";

import React, { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface RejectJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobTitle?: string;
  onConfirm: (reason: string) => Promise<void>;
}

export default function RejectJobModal({
  open,
  onOpenChange,
  jobTitle,
  onConfirm,
}: RejectJobModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (isSubmitting) return;
    setReason("");
    setError("");
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please enter a reason for rejecting this job.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await onConfirm(reason.trim());
      setReason("");
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Failed to reject job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[520px] w-[95vw] p-0 bg-white rounded-2xl shadow-xl border-none font-sans overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header Section */}
          <div className="bg-red-50/60 border-b border-red-100 p-6 sm:p-7 relative">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center shrink-0 shadow-2xs">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="pr-6">
                <DialogTitle className="text-xl font-bold text-slate-900 leading-tight">
                  Reject Job Posting
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-1">
                  {jobTitle ? (
                    <span>Rejecting <strong className="text-slate-800 font-semibold">{jobTitle}</strong>.</span>
                  ) : (
                    "Please provide a reason for rejecting this job posting."
                  )}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Type reason for rejection (e.g. Invalid salary details, incomplete job description, or policy violation)..."
                rows={4}
                className="w-full rounded-xl border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
                autoFocus
              />
              {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 border-t border-slate-100 p-4 sm:px-7 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs font-semibold text-white transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                <span>Confirm Rejection</span>
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
