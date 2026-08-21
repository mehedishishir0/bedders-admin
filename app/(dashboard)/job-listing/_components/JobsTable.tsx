"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobDetailsModal, { JobItem } from "./JobDetailsModal";

export const initialJobsData: JobItem[] = [
    {
        id: "1",
        name: "Care First Limited",
        companyType: "Care Company",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop",
        employmentType: "Full-time",
        title: "Nurse",
        location: "USA",
        experienceLevel: "1–2 years",
        salary: "£14–£18 per hour",
        description:
            "Describe the role, responsibilities, required qualifications, skills, and any additional information about the position.",
    },
    {
        id: "2",
        name: "Care First Limited",
        companyType: "Care Company",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop",
        employmentType: "Part-time",
        title: "Nanny",
        location: "UK",
        experienceLevel: "0–1 years",
        salary: "£12–£15 per hour",
        description:
            "Seeking a compassionate nanny to provide attentive daily childcare and family support.",
    },
    {
        id: "3",
        name: "Care First Limited",
        companyType: "Care Company",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop",
        employmentType: "Part-time",
        title: "Doctor",
        location: "France",
        experienceLevel: "3+ years",
        salary: "£45–£60 per hour",
        description:
            "Experienced medical doctor required for flexible clinical consultations and patient follow-ups.",
    },
    {
        id: "4",
        name: "Care First Limited",
        companyType: "Care Company",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop",
        employmentType: "Full-time",
        title: "Nurse",
        location: "France",
        experienceLevel: "0–1 years",
        salary: "£16–£20 per hour",
        description:
            "Full-time nurse responsible for ongoing inpatient care, medication management, and patient comfort.",
    },
    {
        id: "5",
        name: "Care First Limited",
        companyType: "Care Company",
        logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=120&auto=format&fit=crop",
        employmentType: "Full-time",
        title: "Nanny",
        location: "India",
        experienceLevel: "0–1 years",
        salary: "£10–£14 per hour",
        description:
            "Full-time caregiver required for infant monitoring, safety, and light developmental activities.",
    },
];

export default function JobsTableSection() {
    const [jobs, setJobs] = useState<JobItem[]>(initialJobsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [employmentTypeFilter, setEmploymentTypeFilter] = useState("Employment Type");
    const [experienceLevelFilter, setExperienceLevelFilter] = useState("Experience Level");
    const [titleFilter, setTitleFilter] = useState("Title");

    // Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

    const filteredJobs = useMemo(() => {
        return jobs.filter((job) => {
            const matchSearch =
                job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchType =
                employmentTypeFilter === "Employment Type" ||
                job.employmentType === employmentTypeFilter;

            const matchExp =
                experienceLevelFilter === "Experience Level" ||
                job.experienceLevel === experienceLevelFilter;

            const matchTitle =
                titleFilter === "Title" || job.title === titleFilter;

            return matchSearch && matchType && matchExp && matchTitle;
        });
    }, [jobs, searchTerm, employmentTypeFilter, experienceLevelFilter, titleFilter]);

    const handleApprove = (id: string) => {
        console.log("Approved Job ID:", id);
    };

    const handleReject = (id: string) => {
        console.log("Rejected Job ID:", id);
    };

    const handleViewJob = (job: JobItem) => {
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
                            placeholder="Search..."
                            className="h-10 pl-10 pr-4 rounded-lg border-slate-200 bg-white text-xs placeholder-slate-400 focus-visible:ring-[#2B6CB0]"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Employment Type */}
                        <div className="relative">
                            <select
                                value={employmentTypeFilter}
                                onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
                            >
                                <option value="Employment Type">Employment Type</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Experience Level */}
                        <div className="relative">
                            <select
                                value={experienceLevelFilter}
                                onChange={(e) => setExperienceLevelFilter(e.target.value)}
                                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
                            >
                                <option value="Experience Level">Experience Level</option>
                                <option value="0–1 years">0–1 years</option>
                                <option value="1–2 years">1–2 years</option>
                                <option value="3+ years">3+ years</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Title */}
                        <div className="relative">
                            <select
                                value={titleFilter}
                                onChange={(e) => setTitleFilter(e.target.value)}
                                className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
                            >
                                <option value="Title">Title</option>
                                <option value="Nurse">Nurse</option>
                                <option value="Nanny">Nanny</option>
                                <option value="Doctor">Doctor</option>
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
                                    <th className="py-4 px-6">Name</th>
                                    <th className="py-4 px-6">Employment Type</th>
                                    <th className="py-4 px-6">Title</th>
                                    <th className="py-4 px-6">Location</th>
                                    <th className="py-4 px-6">Experience Level</th>
                                    <th className="py-4 px-6 text-center">Action</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                                {filteredJobs.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">

                                        {/* Name + Logo + Subtitle */}
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
                                                    <Image
                                                        src={row.logo}
                                                        alt={row.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 leading-tight">
                                                        {row.name}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                                                        {row.companyType}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Employment Type Pill */}
                                        <td className="py-4 px-6">
                                            <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-[#E2E8F0] text-slate-700">
                                                {row.employmentType}
                                            </span>
                                        </td>

                                        {/* Title */}
                                        <td className="py-4 px-6 text-slate-700 font-normal">
                                            {row.title}
                                        </td>

                                        {/* Location */}
                                        <td className="py-4 px-6 text-slate-700 font-normal">
                                            {row.location}
                                        </td>

                                        {/* Experience Level */}
                                        <td className="py-4 px-6 text-slate-600 font-normal">
                                            {row.experienceLevel}
                                        </td>

                                        {/* Action: View Eye Icon + Approve + Reject */}
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center gap-2.5">
                                                {/* View Button */}
                                                <button
                                                    onClick={() => handleViewJob(row)}
                                                    title="View Job Details"
                                                    className="p-1 text-slate-400 hover:text-[#2B6CB0] transition-colors"
                                                >
                                                    <Eye className="w-4 h-4 text-amber-600/70 hover:text-amber-700" />
                                                </button>

                                                {/* Approve Button */}
                                                <button
                                                    onClick={() => handleApprove(row.id)}
                                                    className="px-4 py-1.5 rounded-lg bg-[#2E8540] hover:bg-[#256B33] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                                                >
                                                    Approve
                                                </button>

                                                {/* Reject Button */}
                                                <button
                                                    onClick={() => handleReject(row.id)}
                                                    className="px-4 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[11px] font-semibold transition-colors shadow-2xs"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* PAGINATION FOOTER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-400 font-normal">
                    <span>Showing 1 to {filteredJobs.length} of 12 results</span>

                    <div className="flex items-center gap-1.5">
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg bg-[#2B6CB0] text-white font-semibold flex items-center justify-center shadow-xs">
                            1
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50">
                            2
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50">
                            3
                        </button>
                        <span className="px-1 text-slate-400">...</span>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50">
                            8
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>

            {/* JOB DETAILS MODAL */}
            <JobDetailsModal
                open={isViewModalOpen}
                onOpenChange={setIsViewModalOpen}
                jobData={selectedJob}
            />
        </div>
    );
}