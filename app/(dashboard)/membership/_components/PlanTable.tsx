"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Eye, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
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
import ViewPlanModal, { MembershipPlan } from "./ViewPlanModal";
import AddPlanModal from "./AddPlanModal";
import EditPlanModal from "./EditPlanModal";

export default function PlanTableSection() {
  const { data: session } = useSession();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activePlanFilter, setActivePlanFilter] = useState<"All" | "monthly" | "yearly">("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  const { data: responseData, isLoading, refetch } = useQuery({
    queryKey: ['membership-plans'],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.user?.accessToken) {
        headers['Authorization'] = `Bearer ${session.user.accessToken}`;
      }

      const res = await fetch(`${backendUrl}/membership-plans`, { headers });
      if (!res.ok) throw new Error('Failed to fetch membership plans');
      return res.json();
    },
    enabled: !!session,
  });

  const plans: MembershipPlan[] = responseData?.data || [];

  const filteredData = useMemo(() => {
    return plans.filter((item) => {
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPlan = activePlanFilter === "All" || item.duration === activePlanFilter;
      
      return matchSearch && matchPlan;
    });
  }, [plans, searchTerm, activePlanFilter]);

  const openView = (item: MembershipPlan) => {
    setSelectedPlan(item);
    setIsViewOpen(true);
  };

  const openEdit = (item: MembershipPlan) => {
    setSelectedPlan(item);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletePlanId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletePlanId) return;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const headers: Record<string, string> = {};

      if (session?.user?.accessToken) headers['Authorization'] = `Bearer ${session.user.accessToken}`;

      const res = await fetch(`${backendUrl}/membership-plans/${deletePlanId}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || 'Failed to delete plan');
        return;
      }
      toast.success('Plan deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('An error occurred while deleting the plan.');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletePlanId(null);
    }
  };

  return (
    <div className="">
      <div className=" mx-auto space-y-6">
        
        {/* TOP FILTER & ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plan title..."
                className="h-10 pl-10 pr-4 rounded-lg border-slate-200 bg-white text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(["All", "monthly", "yearly"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivePlanFilter(type)}
                  className={`px-3.5 py-1.5 text-xs rounded-full font-medium transition-all capitalize ${
                    activePlanFilter === type
                      ? "bg-[#6BA4D9] text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsAddOpen(true)}
              className="h-10 px-5 rounded-lg bg-[#2B6CB0] hover:bg-[#235891] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs border-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Plan</span>
            </Button>
          </div>
        </div>

        {/* DATA TABLE CONTAINER */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#2B6CB0] text-white text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Plan Title</th>
                  <th className="py-4 px-6 text-center">Duration</th>
                  <th className="py-4 px-6 text-center">Price</th>
                  <th className="py-4 px-6 text-center">Valid Until</th>
                  <th className="py-4 px-6 text-center">Created At</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 mx-auto" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-16 mx-auto" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-24 mx-auto" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-24 mx-auto" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-8 mx-auto" /></td>
                    </tr>
                  ))
                ) : filteredData.length > 0 ? (
                  filteredData.map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                      
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {row.title}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-[11px] font-medium capitalize ${
                            row.duration === "monthly"
                              ? "bg-[#FEF3C7] text-[#D97706]"
                              : "bg-[#F3E8FF] text-[#9333EA]"
                          }`}
                        >
                          {row.duration}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center font-bold text-[#2B6CB0] text-sm">
                        ${row.price}
                      </td>

                      <td className="py-4 px-6 text-center text-slate-500 font-normal">
                        {new Date(row.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="py-4 px-6 text-center text-slate-600 font-normal">
                        {new Date(row.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openView(row)}
                            title="View Details"
                            className="p-1.5 text-slate-400 hover:text-[#2B6CB0] transition-colors"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => openEdit(row)}
                            title="Edit Plan"
                            className="p-1.5 text-slate-400 hover:text-[#2B6CB0] transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(row._id)}
                            title="Delete Plan"
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400 font-medium bg-slate-50/30">
                      No membership plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-normal">
          <span>Showing 1 to {filteredData.length} of {plans.length} results</span>

          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#2B6CB0] text-white font-semibold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      <AddPlanModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmitSuccess={async (newPlan) => {
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
            
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
            };
            if (session?.user?.accessToken) headers['Authorization'] = `Bearer ${session.user.accessToken}`;

            const res = await fetch(`${backendUrl}/membership-plans`, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                title: newPlan.title,
                price: parseFloat(newPlan.price as string),
                duration: newPlan.billingFrequency.toLowerCase(),
                content: newPlan.content,
                date: new Date().toISOString(),
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              toast.error(data.message || 'Failed to create plan');
              return;
            }
            toast.success('Plan created successfully!');
            refetch();
          } catch (error) {
            console.error('Error creating plan:', error);
            toast.error('An error occurred while creating the plan.');
          }
        }}
      />

      <EditPlanModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        planData={selectedPlan}
        onSubmitSuccess={async (updatedPlan) => {
          try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
            
            const headers: Record<string, string> = {
              'Content-Type': 'application/json',
            };
            if (session?.user?.accessToken) headers['Authorization'] = `Bearer ${session.user.accessToken}`;

            const res = await fetch(`${backendUrl}/membership-plans/${selectedPlan?._id}`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                title: updatedPlan.title,
                price: parseFloat(updatedPlan.price as string),
                duration: updatedPlan.billingFrequency.toLowerCase(),
                content: updatedPlan.content,
              }),
            });
            const data = await res.json();
            if (!res.ok) {
              toast.error(data.message || 'Failed to update plan');
              return;
            }
            toast.success('Plan updated successfully!');
            refetch();
          } catch (error) {
            console.error('Error updating plan:', error);
            toast.error('An error occurred while updating the plan.');
          }
        }}
      />

      <ViewPlanModal
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
        planData={selectedPlan}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the membership plan from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}