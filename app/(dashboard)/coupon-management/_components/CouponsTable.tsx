"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateCouponModal, { CouponFormValues } from "./CreateCouponModal";
import UpdateCouponModal from "./UpdateCouponModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface CouponItem {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountValue: string;
  eligibleUsers: string;
  usedCount: number;
  totalLimit: number;
  startDate?: string;
  expiryDate: string;
  status: "Active" | "Scheduled" | "Expired";
}

export interface CouponApiResponse {
  _id: string;
  couponName: string;
  couponCode: string;
  description: string;
  discountValue: number;
  totalUsageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  validitySettings: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function CouponsTable() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data: responseData, isLoading } = useQuery({
    queryKey: ['coupons'],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/coupons`, {
        headers: {
          "Authorization": `Bearer ${session?.user?.accessToken || ""}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch coupons');
      return res.json();
    },
    enabled: !!session?.user?.accessToken,
  });

  const couponsData = responseData?.data || [];
  
  const mappedCoupons: CouponItem[] = couponsData.map((item: CouponApiResponse) => {
    const now = new Date();
    const expiry = new Date(item.expiryDate);
    const start = new Date(item.startDate);
    
    let status: "Active" | "Scheduled" | "Expired" = "Active";
    if (now > expiry) {
      status = "Expired";
    } else if (now < start) {
      status = "Scheduled";
    }

    return {
      id: item._id,
      code: item.couponCode,
      name: item.couponName,
      description: item.description,
      discountValue: `${item.discountValue}%`,
      eligibleUsers: item.validitySettings === "ALL_USERS" ? "All Users" : item.validitySettings,
      usedCount: item.usedCount || 0,
      totalLimit: item.totalUsageLimit || 100,
      startDate: item.startDate,
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "N/A",
      status: status
    };
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Scheduled" | "Expired">("All");
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const filteredCoupons = useMemo(() => {
    return mappedCoupons.filter((item) => {
      const matchesSearch =
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.eligibleUsers.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [mappedCoupons, searchTerm, statusFilter]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/coupons/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session?.user?.accessToken || ""}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete coupon");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Coupon deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setIsDeleteDialogOpen(false);
      setCouponToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const confirmDelete = () => {
    if (couponToDelete) {
      deleteMutation.mutate(couponToDelete);
    }
  };

  const handleEditClick = (coupon: CouponItem) => {
    setSelectedCoupon(coupon);
    setIsUpdateModalOpen(true);
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
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-2 w-24 rounded-full" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Skeleton className="h-6 w-16 rounded-full mx-auto" />
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Skeleton className="h-7 w-16 rounded-lg mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No coupons found.
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((row) => {
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

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(row)}
                            className="px-4 py-1.5 rounded-lg bg-[#2B6CB0] hover:bg-[#235891] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setCouponToDelete(row.id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="px-4 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CREATE COUPON MODAL */}
      <CreateCouponModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* UPDATE COUPON MODAL */}
      <UpdateCouponModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        couponData={selectedCoupon}
      />

      {/* DELETE CONFIRMATION ALERT DIALOG */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the coupon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}