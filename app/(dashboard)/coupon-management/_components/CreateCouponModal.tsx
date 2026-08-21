"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const couponFormSchema = z.object({
  couponName: z.string().min(2, "Coupon name is required"),
  couponCode: z.string().min(2, "Coupon code is required"),
  description: z.string().optional(),
  discountValue: z.string().min(1, "Discount value is required"),
  totalUsageLimit: z.string().min(1, "Total usage limit is required"),
  startDate: z.string().min(1, "Start date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  validityTarget: z.enum(["All Users", "First-Time Users"]),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;

interface CreateCouponModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitSuccess?: (data: CouponFormValues) => void;
}

export default function CreateCouponModal({
  open,
  onOpenChange,
  onSubmitSuccess,
}: CreateCouponModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema),
    defaultValues: {
      couponName: "Summer Sale 2026",
      couponCode: "SUMMER25",
      description: "",
      discountValue: "25%",
      totalUsageLimit: "5000",
      startDate: "2026-08-01",
      expiryDate: "2026-08-31",
      validityTarget: "All Users",
    },
  });

  const formValues = watch();

  const onSubmit = (data: CouponFormValues) => {
    console.log("Create Coupon Submitted Data:", data);
    if (onSubmitSuccess) onSubmitSuccess(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[960px] w-[94vw] p-8 sm:p-10 bg-white rounded-3xl shadow-2xl border-none font-sans overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Create New Coupon</DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Coupon Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Coupon Name
                  </label>
                  <Input
                    {...register("couponName")}
                    placeholder="e.g. Summer Sale 2026"
                    className="h-10 rounded-lg border-slate-200 text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
                  />
                  {errors.couponName && (
                    <p className="text-[11px] text-red-500">{errors.couponName.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Coupon Code
                  </label>
                  <Input
                    {...register("couponCode")}
                    placeholder="e.g. SUMMER25"
                    className="h-10 rounded-lg border-slate-200 text-xs placeholder-slate-400 uppercase focus-visible:ring-[#2B6CB0]"
                  />
                  {errors.couponCode && (
                    <p className="text-[11px] text-red-500">{errors.couponCode.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700">
                  Description
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="Briefly describe this coupon campaign..."
                  className="min-h-[90px] rounded-lg border-slate-200 text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0] resize-none"
                />
              </div>

              {/* Discount Value */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700">
                  Discount Value
                </label>
                <Input
                  {...register("discountValue")}
                  placeholder="25%"
                  className="h-10 rounded-lg border-slate-200 text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
                />
                {errors.discountValue && (
                  <p className="text-[11px] text-red-500">{errors.discountValue.message}</p>
                )}
              </div>

              {/* Total Usage Limit */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-700">
                  Total Usage Limit
                </label>
                <Input
                  {...register("totalUsageLimit")}
                  placeholder="e.g. 5000"
                  className="h-10 rounded-lg border-slate-200 text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
                />
                {errors.totalUsageLimit && (
                  <p className="text-[11px] text-red-500">{errors.totalUsageLimit.message}</p>
                )}
              </div>

              {/* Start Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    {...register("startDate")}
                    className="h-10 rounded-lg border-slate-200 text-xs text-slate-700 focus-visible:ring-[#2B6CB0]"
                  />
                  {errors.startDate && (
                    <p className="text-[11px] text-red-500">{errors.startDate.message}</p>
                  )}
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-700">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    {...register("expiryDate")}
                    className="h-10 rounded-lg border-slate-200 text-xs text-slate-700 focus-visible:ring-[#2B6CB0]"
                  />
                  {errors.expiryDate && (
                    <p className="text-[11px] text-red-500">{errors.expiryDate.message}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column: Live Preview & Validity Settings */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Live Preview Card */}
              <div className="space-y-2 text-left">
                <h3 className="text-sm font-bold text-slate-800">Live Preview</h3>
                <div className="p-5 rounded-2xl bg-[#EAF2FF] border border-[#BFDBFE] flex flex-col items-start gap-2.5 shadow-xs">
                  <span className="text-[11px] text-[#3B82F6] font-medium">
                    Coupon Code
                  </span>
                  <span className="text-lg font-bold text-slate-900 tracking-tight">
                    {formValues.couponCode || "SUMMER25"}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#6366F1] text-white text-[11px] font-bold">
                    {formValues.discountValue || "25%"} OFF
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal pt-1">
                    Valid for {formValues.validityTarget || "All Users"}
                  </span>
                </div>
              </div>

              {/* Validity Settings */}
              <div className="space-y-2 text-left">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-800">Validity Settings</h3>
                  <p className="text-[11px] text-slate-400 font-normal">
                    Set the active window for this coupon
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {/* Option 1: All Users */}
                  <div
                    onClick={() => setValue("validityTarget", "All Users")}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      formValues.validityTarget === "All Users"
                        ? "border-[#2B6CB0] bg-[#F0F7FF]"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">All Users</h4>
                      <p className="text-[10px] text-slate-400">Available to everyone</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formValues.validityTarget === "All Users"
                          ? "border-[#2B6CB0]"
                          : "border-slate-300"
                      }`}
                    >
                      {formValues.validityTarget === "All Users" && (
                        <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" />
                      )}
                    </div>
                  </div>

                  {/* Option 2: First-Time Users */}
                  <div
                    onClick={() => setValue("validityTarget", "First-Time Users")}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      formValues.validityTarget === "First-Time Users"
                        ? "border-[#2B6CB0] bg-[#F0F7FF]"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-slate-800">First-Time Users</h4>
                      <p className="text-[10px] text-slate-400">Only new customers</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formValues.validityTarget === "First-Time Users"
                          ? "border-[#2B6CB0]"
                          : "border-slate-300"
                      }`}
                    >
                      {formValues.validityTarget === "First-Time Users" && (
                        <div className="w-2 h-2 rounded-full bg-[#2B6CB0]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Modal Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-lg border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-lg bg-[#2B6CB0] hover:bg-[#235891] text-white text-xs font-semibold shadow-none transition-colors"
            >
              Create Coupon
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}