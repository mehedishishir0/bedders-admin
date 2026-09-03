"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import JobDetailsModal from "./JobDetailsModal";
import RejectJobModal from "./RejectJobModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function JobsTableSection() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Status");

    // Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectingJob, setRejectingJob] = useState<{ id: string; title: string } | null>(null);

    const { data: responseData, isLoading, refetch } = useQuery({
        queryKey: ['admin-jobs'],
        queryFn: async () => {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            // @ts-ignore
            if (session?.user?.accessToken) headers['Authorization'] = `Bearer ${session.user.accessToken}`;

            const res = await fetch(`${backendUrl}/jobs/admin/get-jobs`, { headers });
            if (!res.ok) throw new Error('Failed to fetch jobs');
            return res.json();
        },
        enabled: !!session,
    });

    const jobs = responseData?.data || [];

    const filteredJobs = useMemo(() => {
        return jobs.filter((job: any) => {
            const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "Status" || job.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [jobs, searchTerm, statusFilter]);

    const handleApprove = async (id: string) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            // @ts-ignore
            if (session?.user?.accessToken) headers['Authorization'] = `Bearer ${session.user.accessToken}`;

            const res = await fetch(`${backendUrl}/jobs/admin/approve-job`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ jobId: id, reason: "Approved by Admin" }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || 'Failed to approve job');
                return;
            }
            toast.success('Job approved successfully!');
            refetch();
        } catch (error) {
            toast.error('An error occurred while approving the job.');
        }
    };

    const handleOpenRejectModal = (job: any) => {
        setRejectingJob({ id: job._id, title: job.title });
        setIsRejectModalOpen(true);
    };

    const handleConfirmReject = async (reason: string) => {
        if (!rejectingJob) return;
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        // @ts-ignore
        if (session?.user?.accessToken) headers['Authorization'] = `Bearer ${session.user.accessToken}`;

        const res = await fetch(`${backendUrl}/jobs/admin/reject-job`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ jobId: rejectingJob.id, reason }),
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'Failed to reject job');
        }
        toast.success('Job rejected successfully!');
        refetch();
    };

    const handleViewJob = (job: any) => {
        setSelectedJob(job);
        setIsViewModalOpen(true);
    };

    return (
        <div >
            <div className=" mx-auto space-y-6">

                {/* TOP FILTER & SEARCH ROW */}
                <div className="flex flex-wrap items-center justify-between gap-4">

                    {/* Search Input */}
                    <div className="relative w-80">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search title or location..."
                            className="h-10 pl-10 pr-4 rounded-lg border-slate-200 bg-white text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer capitalize"
                            >
                                <option value="Status">All Status</option>
                                <option value="pending_approval">Pending Approval</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="draft">Draft</option>
                                <option value="closed">Closed</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* DATA TABLE CONTAINER */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Blue Table Header */}
                            <thead>
                                <tr className="bg-[#2B6CB0] text-white text-xs font-semibold">
                                    <th className="py-4 px-6">Title</th>
                                    <th className="py-4 px-6">Company</th>
                                    <th className="py-4 px-6">Type</th>
                                    <th className="py-4 px-6">Location</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-center">Action</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                                            <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                                            <td className="py-4 px-6"><Skeleton className="h-4 w-20" /></td>
                                            <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                                            <td className="py-4 px-6"><Skeleton className="h-4 w-16" /></td>
                                            <td className="py-4 px-6"><Skeleton className="h-6 w-16 mx-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredJobs.length > 0 ? (
                                    filteredJobs.map((row: any) => (
                                        <tr key={row._id} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-4 px-6">
                                                <h4 className="font-bold text-slate-900 leading-tight">
                                                    {row.title}
                                                </h4>
                                                <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                                                    Posted: {new Date(row.createdAt).toLocaleDateString()}
                                                </p>
                                            </td>

                                            <td className="py-4 px-6 font-semibold text-slate-900">
                                                {row.organizationUserId?.fullName || "Care Organization"}
                                            </td>

                                            <td className="py-4 px-6 font-normal capitalize">
                                                {row.jobType?.replace('_', ' ') || "N/A"}
                                            </td>

                                            <td className="py-4 px-6 font-normal">
                                                {row.location || row.city || "N/A"}
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className={`inline-block px-3 py-1 rounded-md text-[11px] font-semibold capitalize ${
                                                    row.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                    row.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
                                                    row.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {row.status?.replace('_', ' ')}
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-2.5">
                                                    <button
                                                        onClick={() => handleViewJob(row)}
                                                        title="View Job Details"
                                                        className="p-1 text-slate-400 hover:text-[#2B6CB0] transition-colors cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4 text-amber-600/70 hover:text-amber-700" />
                                                    </button>

                                                    {row.status !== 'closed' && (
                                                        <>
                                                            {row.status !== 'approved' && (
                                                                <button
                                                                    onClick={() => handleApprove(row._id)}
                                                                    className="px-3 py-1.5 rounded-lg bg-[#2E8540] hover:bg-[#256B33] text-white text-[11px] font-semibold transition-colors shadow-2xs cursor-pointer"
                                                                >
                                                                    Approve
                                                                </button>
                                                            )}
                                                            {row.status !== 'rejected' && (
                                                                <button
                                                                    onClick={() => handleOpenRejectModal(row)}
                                                                    className="px-3 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors shadow-2xs cursor-pointer"
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-400 font-medium bg-slate-50/30">
                                            No jobs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION FOOTER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-normal">
                    <span>Showing 1 to {filteredJobs.length} of {jobs.length} results</span>
                </div>
            </div>

            {/* JOB DETAILS MODAL */}
            <JobDetailsModal
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
                jobData={selectedJob}
            />

            {/* REJECT JOB REASON MODAL */}
            <RejectJobModal
                open={isRejectModalOpen}
                onOpenChange={setIsRejectModalOpen}
                jobTitle={rejectingJob?.title}
                onConfirm={handleConfirmReject}
            />
        </div>
    );
}