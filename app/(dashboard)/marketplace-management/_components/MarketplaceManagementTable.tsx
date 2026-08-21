"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, ChevronDown, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import MarketplaceDetailsModal, {
  MarketplaceItem,
} from "./MarketplaceDetailsModal";

export const initialMarketplaceData: MarketplaceItem[] = [
  {
    id: "1",
    name: "Medicine",
    subName: "Vitamin Medicine",
    companyName: "Care Company",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=120&auto=format&fit=crop",
    category: "Medication",
    price: "$40",
    amount: "$70",
    expiryDate: "March 13, 2014",
  },
  {
    id: "2",
    name: "Sthethoscope",
    subName: "Standard Stethoscope",
    companyName: "Care Company",
    image:
      "https://images.unsplash.com/photo-1584982751601-97dcc096659c?q=80&w=120&auto=format&fit=crop",
    category: "Gym",
    price: "$40",
    amount: "$65",
    expiryDate: "February 9, 2015",
  },
  {
    id: "3",
    name: "Pressure machine",
    subName: "Digital BP Monitor",
    companyName: "Care Company",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=120&auto=format&fit=crop",
    category: "Docor",
    price: "$40",
    amount: "$85",
    expiryDate: "February 11, 2014",
  },
  {
    id: "4",
    name: "Gloves",
    subName: "Latex Exam Gloves",
    companyName: "Care Company",
    image:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?q=80&w=120&auto=format&fit=crop",
    category: "Instruments",
    price: "$40",
    amount: "$50",
    expiryDate: "February 11, 2014",
  },
  {
    id: "5",
    name: "Machine",
    subName: "Sterilization Machine",
    companyName: "Care Company",
    image:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=120&auto=format&fit=crop",
    category: "Clothes",
    price: "$40",
    amount: "$120",
    expiryDate: "May 6, 2012",
  },
];

export default function MarketplaceManagementTable() {
  const [items, setItems] = useState<MarketplaceItem[]>(initialMarketplaceData);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Category");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        categoryFilter === "Category" || item.category === categoryFilter;

      return matchSearch && matchCategory;
    });
  }, [items, searchTerm, categoryFilter]);

  const handleApprove = (id: string) => {
    console.log("Approved Marketplace Item ID:", id);
  };

  const handleReject = (id: string) => {
    console.log("Rejected Marketplace Item ID:", id);
  };

  const handleViewDetails = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
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

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 appearance-none bg-white border border-slate-200 rounded-lg px-4 pr-9 text-xs text-slate-600 outline-none hover:border-slate-300 transition-colors cursor-pointer"
            >
              <option value="Category">Category</option>
              <option value="Medication">Medication</option>
              <option value="Gym">Gym</option>
              <option value="Docor">Docor</option>
              <option value="Instruments">Instruments</option>
              <option value="Clothes">Clothes</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Expiry Date</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredItems.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Name + Thumbnail + Company */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-slate-100">
                          <Image
                            src={row.image}
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
                            {row.companyName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category Pill */}
                    <td className="py-4 px-6">
                      <span className="inline-block px-3 py-1 rounded-md text-[11px] font-semibold bg-[#E2E8F0] text-slate-700">
                        {row.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-slate-700 font-normal">
                      {row.price}
                    </td>

                    {/* Expiry Date */}
                    <td className="py-4 px-6 text-slate-600 font-normal">
                      {row.expiryDate}
                    </td>

                    {/* Actions: View + Approve + Reject */}
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewDetails(row)}
                          title="View Details"
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
          <span>Showing 1 to {filteredItems.length} of 12 results</span>

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

      {/* MARKETPLACE DETAILS MODAL */}
      <MarketplaceDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        data={selectedItem}
      />
    </div>
  );
}