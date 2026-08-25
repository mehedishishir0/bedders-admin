"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  Ban,
  RotateCcw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ViewUserDetailsModal from "./ViewUserDetailsModal";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// ==========================================
// 1. DATA TYPES
// ==========================================
export type UserRole = "admin" | "supplier" | "service_provider" | "carer" | "care_company" | "family" | string;
export type UserStatus = "active" | "suspended" | "pending" | "rejected" | string;

export interface UserRowItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joiningDate: string;
  location: string;
  status: UserStatus;
  details: any;
}

export interface UserApiResponse {
  _id: string;
  fullName?: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  country?: string;
  address?: string;
  details?: any;
}

const locationFilterOptions = ["All Locations", "USA", "UK", "France", "India", "Bangladesh"];
const roleFilterOptions: ("All Roles" | UserRole)[] = [
  "All Roles",
  "admin",
  "supplier",
  "service_provider",
  "carer",
  "care_company",
  "family",
];
const statusFilterOptions: ("All Status" | UserStatus)[] = [
  "All Status",
  "active",
  "pending",
  "suspended",
  "rejected"
];

// ==========================================
// 2. MAIN DATA TABLE COMPONENT
// ==========================================
export default function UserManagementTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRowItem | null>(null);
  
  // Delete Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch Users API
  const { data: responseData, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/user`, {
        headers: {
          "Authorization": `Bearer ${session?.user?.accessToken || ""}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      return res.json();
    },
    enabled: !!session?.user?.accessToken,
  });

  const apiUsers: UserApiResponse[] = responseData?.data || [];

  // Map API Data to Table Rows
  const users: UserRowItem[] = useMemo(() => {
    return apiUsers.map((item) => {
      let location = "N/A";
      if (item.country) location = item.country;
      else if (item.details?.country) location = item.details.country;
      else if (item.address) location = item.address;
      else if (item.details?.address) location = item.details.address;
      else if (item.details?.city) location = item.details.city;

      let name = item.fullName || "N/A";
      if (!item.fullName && item.details?.companyName) name = item.details.companyName;
      if (!item.fullName && item.details?.firstName) name = `${item.details.firstName} ${item.details.lastName || ""}`.trim();

      return {
        id: item._id,
        name,
        email: item.email,
        role: item.role,
        joiningDate: new Date(item.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
        location,
        status: item.status,
        details: item.details,
      };
    });
  }, [apiUsers]);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === "All Locations" ||
        user.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesRole =
        selectedRole === "All Roles" || user.role === selectedRole;

      const matchesStatus =
        selectedStatus === "All Status" || user.status === selectedStatus;

      return matchesSearch && matchesLocation && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedLocation, selectedRole, selectedStatus]);

  // Status Mutation (Approve, Reject, Suspend, Reactivate)
  const statusMutation = useMutation({
    mutationFn: async ({ action, userId }: { action: string; userId: string }) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/profiles/admin/${action}-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.user?.accessToken || ""}`
        },
        body: JSON.stringify({ userId, reason: `Admin triggered ${action}` })
      });
      
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || `Failed to ${action} profile`);
      }
      return { action, data };
    },
    onSuccess: (result) => {
      toast.success(`Profile ${result.action}d successfully`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${backendUrl}/user/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session?.user?.accessToken || ""}`
        }
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  const handleStatusChange = (userId: string, action: string) => {
    statusMutation.mutate({ userId, action });
  };

  const handleViewDetails = (user: UserRowItem) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "border-[#4ADE80] text-[#16A34A] bg-[#F0FDF4]/50";
      case "pending":
        return "border-blue-300 text-blue-600 bg-blue-50/50";
      case "suspended":
      case "rejected":
        return "border-[#FBBF24] text-[#D97706] bg-[#FFFBEB]/50";
      default:
        return "border-slate-200 text-slate-600 bg-slate-50";
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 sm:p-6 md:p-8 font-sans text-slate-700">
      <div className=" mx-auto space-y-6">
        
        {/* Top Control Toolbar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-[340px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-slate-700 placeholder-slate-400 pl-11 pr-4 py-2.5 rounded-lg text-sm border border-blue-200/90 outline-none focus:ring-2 focus:ring-[#2C72A9]/20 transition-all shadow-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="relative min-w-[130px] flex-1 sm:flex-initial">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors"
              >
                {locationFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All Locations" ? "Location" : opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2C72A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors capitalize"
              >
                {roleFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All Roles" ? "Role" : opt.replace("_", " ")}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2C72A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative min-w-[120px] flex-1 sm:flex-initial">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white border border-slate-200/90 rounded-lg px-4 py-2 text-xs font-normal text-[#2C72A9] outline-none appearance-none cursor-pointer pr-9 shadow-xs hover:border-slate-300 transition-colors capitalize"
              >
                {statusFilterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "All Status" ? "Status" : opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#2C72A9] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#2B73A8] text-white text-xs font-medium">
                  <th className="py-3.5 px-6 text-left w-[22%] rounded-tl-xl">Name</th>
                  <th className="py-3.5 px-6 text-center w-[14%]">Role</th>
                  <th className="py-3.5 px-6 text-center w-[18%]">Joining Date</th>
                  <th className="py-3.5 px-6 text-center w-[16%]">Location</th>
                  <th className="py-3.5 px-6 text-center w-[16%]">Status</th>
                  <th className="py-3.5 px-6 text-center w-[14%] rounded-tr-xl">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-20 mx-auto rounded-md" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-24 mx-auto" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-4 w-20 mx-auto" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></td>
                      <td className="py-4 px-6"><Skeleton className="h-6 w-8 mx-auto rounded-md" /></td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-slate-800 text-left">
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{user.email}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <Badge
                          variant="secondary"
                          className="bg-[#DCEBF6] hover:bg-[#DCEBF6] text-[#2C72A9] font-medium text-xs px-3 py-1 rounded shadow-none border-none cursor-default capitalize"
                        >
                          {user.role.replace("_", " ")}
                        </Badge>
                      </td>

                      <td className="py-4 px-6 text-slate-600 text-center font-normal">
                        {user.joiningDate}
                      </td>

                      <td className="py-4 px-6 text-slate-600 text-center font-normal truncate max-w-[150px]">
                        {user.location}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span
                          className={`inline-block px-4 py-1 rounded-full text-[11px] font-medium border capitalize ${getStatusStyle(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 cursor-pointer">
                            <MoreVertical className="w-4 h-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border-slate-100 shadow-xl rounded-xl p-1.5 font-sans">
                            <DropdownMenuItem 
                              onClick={() => handleViewDetails(user)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer rounded-lg font-medium transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" />
                              View Profile
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="my-1 bg-slate-100" />
                            
                            {user.status === "pending" && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(user.id, "approve")}
                                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-green-50 hover:text-green-700 cursor-pointer rounded-lg font-medium transition-colors"
                                >
                                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(user.id, "reject")}
                                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg font-medium transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-red-500" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}

                            {user.status === "active" && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(user.id, "suspend")}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 cursor-pointer rounded-lg font-medium transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5 text-amber-500" />
                                Suspend
                              </DropdownMenuItem>
                            )}

                            {(user.status === "suspended" || user.status === "rejected") && (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(user.id, "reactivate")}
                                className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer rounded-lg font-medium transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
                                Reactivate
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator className="my-1 bg-slate-100" />

                            <DropdownMenuItem 
                              onClick={() => {
                                setUserToDelete(user.id);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-lg font-medium transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-slate-400 text-sm font-medium bg-slate-50/30"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-8 h-8 text-slate-300 mb-3" />
                        No users or profiles found.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-500 font-medium">
            Showing 1 to {filteredUsers.length} of {responseData?.meta?.total || filteredUsers.length} results
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 text-xs transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all shadow-xs ${
                currentPage === 1
                  ? "bg-[#2B73A8] text-white border-none shadow-md shadow-blue-500/20"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 text-xs transition-all shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      <ViewUserDetailsModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        userData={selectedUser}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl bg-white p-6 max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm">
              This action cannot be undone. This will permanently delete the user's account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:space-x-3">
            <AlertDialogCancel 
              disabled={deleteMutation.isPending}
              className="rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 focus:ring-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleteMutation.isPending}
              className="rounded-lg bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-600/20 border-none transition-all shadow-md shadow-red-500/20"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}