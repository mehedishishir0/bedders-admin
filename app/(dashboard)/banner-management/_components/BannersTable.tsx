"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Edit, Trash2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CreateBannerModal from "./CreateBannerModal";
import UpdateBannerModal from "./UpdateBannerModal";
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

export interface BannerItem {
  id: string;
  title?: string;
  image: string;
  description?: string;
  link?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface BannerApiResponse {
  _id: string;
  title?: string;
  image: string;
  description?: string;
  link?: string;
  isActive?: boolean;
  createdAt?: string;
}

export default function BannersTable() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerItem | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/banners`, {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch banners");
      return res.json();
    },
    enabled: !!session?.user?.accessToken,
  });

  const bannersData: BannerApiResponse[] = responseData?.data || [];

  const mappedBanners: BannerItem[] = useMemo(() => {
    return bannersData.map((item) => ({
      id: item._id,
      title: item.title,
      image: item.image,
      description: item.description,
      link: item.link,
      isActive: item.isActive ?? true,
      createdAt: item.createdAt,
    }));
  }, [bannersData]);

  const filteredBanners = useMemo(() => {
    return mappedBanners.filter((banner) => {
      const query = searchTerm.toLowerCase();
      return (
        banner.title?.toLowerCase().includes(query) ||
        banner.description?.toLowerCase().includes(query) ||
        banner.link?.toLowerCase().includes(query)
      );
    });
  }, [mappedBanners, searchTerm]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken || ""}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete banner");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Banner deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
      setDeleteId(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete banner");
      setDeleteId(null);
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#3B386E]">Banner Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, update, and manage promotional banners for the website.
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#2A6592] hover:bg-[#1f4c70] text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </Button>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by title, description, or link..."
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
                <th className="p-4">Image</th>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4">Target Link</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4">
                      <Skeleton className="w-16 h-10 rounded-md" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-32 h-4" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-48 h-4" />
                    </td>
                    <td className="p-4">
                      <Skeleton className="w-24 h-4" />
                    </td>
                    <td className="p-4 text-right">
                      <Skeleton className="w-16 h-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredBanners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No banners found. Click &quot;Add Banner&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="relative w-20 h-12 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        {banner.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={banner.image}
                            alt={banner.title || "Banner"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {banner.title || <span className="text-slate-400 italic">Untitled</span>}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">
                      {banner.description || <span className="text-slate-400">N/A</span>}
                    </td>
                    <td className="p-4 text-slate-600">
                      {banner.link ? (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#2A6592] hover:underline flex items-center gap-1 max-w-[200px] truncate"
                        >
                          {banner.link}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedBanner(banner);
                            setIsUpdateOpen(true);
                          }}
                          className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(banner.id)}
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
      <CreateBannerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* Update Modal */}
      <UpdateBannerModal
        isOpen={isUpdateOpen}
        onClose={() => {
          setIsUpdateOpen(false);
          setSelectedBanner(null);
        }}
        banner={selectedBanner}
      />

      {/* Delete Confirmation Alert */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected banner.
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
              {deleteMutation.isPending ? "Deleting..." : "Delete Banner"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
