"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Edit, Trash2, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateCareSkillModal from "./CreateCareSkillModal";
import UpdateCareSkillModal from "./UpdateCareSkillModal";
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

export interface CareSkillItem {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface CareSkillApiResponse {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
}

export default function CareSkillsTable() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<CareSkillItem | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["care-skills"],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/care-skills?limit=100`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch care skills");
      return res.json();
    },
    enabled: !!session?.user?.accessToken,
  });

  const skillsData: CareSkillApiResponse[] = responseData?.data || [];

  const mappedSkills: CareSkillItem[] = useMemo(() => {
    return skillsData.map((item) => ({
      id: item._id,
      name: item.name,
      description: item.description,
      isActive: item.isActive ?? true,
      createdAt: item.createdAt,
    }));
  }, [skillsData]);

  const filteredSkills = useMemo(() => {
    return mappedSkills.filter((skill) => {
      const query = searchTerm.toLowerCase();
      return (
        skill.name?.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query)
      );
    });
  }, [mappedSkills, searchTerm]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/care-skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete care skill");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Care skill deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["care-skills"] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete care skill");
      setDeleteId(null);
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3B386E]">Care Skills Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Add and manage predefined care skills available for carers in the system.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#2A6592] hover:bg-[#1f4c70] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </Button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by skill name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {/* Table section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-4">Skill Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4">
                      <Skeleton className="w-36 h-4" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-64 h-4" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-16 h-4" />
                    </td>
                    <td className="p-4 text-right">
                      <Skeleton className="w-16 h-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredSkills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">
                    No care skills found. Click &quot;Add Skill&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-semibold text-slate-800 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#2A6592] flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                      <span>{skill.name}</span>
                    </td>
                    <td className="p-4 text-slate-600 max-w-md truncate">
                      {skill.description || <span className="text-slate-400">No description provided</span>}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          skill.isActive !== false
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {skill.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSkill(skill);
                            setIsUpdateOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(skill.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <CreateCareSkillModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Update Modal */}
      <UpdateCareSkillModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedSkill(null);
        }}
        skill={selectedSkill}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected care skill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Skill"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
