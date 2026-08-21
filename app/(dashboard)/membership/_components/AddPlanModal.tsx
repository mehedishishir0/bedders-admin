"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlanFormData } from "@/types/types";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  price: z.string().min(1, "Price is required"),
  billingFrequency: z.enum(["Monthly", "Yearly", "Monthly/Yearly"]),
  content: z.string().min(5, "Content description must be at least 5 characters"),
});

interface AddPlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: (data: PlanFormData) => void;
}

export default function AddPlanModal({
  open,
  onOpenChange,
  onSubmitSuccess,
}: AddPlanModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PlanFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: "",
      billingFrequency: "Monthly/Yearly",
      content: "",
    },
  });

  const onSubmit = (data: PlanFormData) => {
    console.log("Add Plan Submitted Data:", data);
    if (onSubmitSuccess) onSubmitSuccess(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] w-[92vw] p-8 bg-white rounded-2xl shadow-2xl border-none font-sans overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4">
          <DialogTitle className="text-xl font-bold text-slate-800">
            Add Plan
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-slate-500 hover:text-slate-700 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Title */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-600">Title</label>
            <Input
              {...register("title")}
              placeholder="Enter Plan Title"
              className="h-11 rounded-lg border-slate-200 text-xs sm:text-sm placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
            />
            {errors.title && (
              <p className="text-[11px] text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-600">Price</label>
            <Input
              {...register("price")}
              placeholder="$200"
              className="h-11 rounded-lg border-slate-200 text-xs sm:text-sm placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
            />
            {errors.price && (
              <p className="text-[11px] text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Billing Frequency Dropdown */}
          <div className="space-y-1.5 text-left relative">
            <label className="text-xs font-semibold text-slate-600">Billing Type</label>
            <div className="relative">
              <select
                {...register("billingFrequency")}
                className="w-full h-11 appearance-none bg-white rounded-lg border border-slate-200 px-3.5 pr-10 text-xs sm:text-sm text-slate-700 outline-none focus:border-[#2B6CB0] focus:ring-1 focus:ring-[#2B6CB0] transition-all cursor-pointer"
              >
                <option value="Monthly/Yearly">Monthly/Yearly</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.billingFrequency && (
              <p className="text-[11px] text-red-500">{errors.billingFrequency.message}</p>
            )}
          </div>

          {/* Content / Description Textarea */}
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-600">Content</label>
            <Textarea
              {...register("content")}
              placeholder="Plan Descriptions:"
              className="min-h-[140px] rounded-lg border-slate-200 text-xs sm:text-sm placeholder-slate-400 focus-visible:ring-[#2B6CB0] resize-none"
            />
            {errors.content && (
              <p className="text-[11px] text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Submit Action Button */}
          <div className="pt-3">
            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-[#2B6CB0] hover:bg-[#235891] text-white text-sm font-semibold transition-colors shadow-none"
            >
              Add Plan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}