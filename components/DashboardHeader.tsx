"use client";

import { usePathname } from "next/navigation";

export default function DashboardHeader() {
  const pathname = usePathname();

  const getHeaderInfo = () => {
    if (pathname === "/settings") {
      return { title: "Settings", subtitle: "Manage your account settings" };
    }
    // Service Routes
    if (pathname.includes("/service/dashboard-overview")) {
      return { title: "Dashboard Overview", subtitle: "Overview of your service dashboard" };
    }
    if (pathname.includes("/service/my-profile")) {
      return { title: "My Profile", subtitle: "Manage your business profile visible to care organisations" };
    }
    if (pathname.includes("/service/my-services")) {
      return { title: "My Services", subtitle: "Manage your available services" };
    }
    if (pathname.includes("/service/enquiries")) {
      return { title: "Enquiries", subtitle: "View and respond to your enquiries" };
    }
    if (pathname.includes("/service/settings")) {
      return { title: "Settings", subtitle: "Manage your account settings" };
    }
    // Supplier Routes
    if (pathname.includes("/supplier/overview")) {
      return { title: "Overview", subtitle: "Overview of your supplier dashboard" };
    }
    if (pathname.includes("/supplier/categories")) {
      return { title: "Categories", subtitle: "Manage your product categories" };
    }
    if (pathname.includes("/supplier/products")) {
      return { title: "Products", subtitle: "Manage your products catalog" };
    }
    if (pathname.includes("/supplier/orders")) {
      return { title: "Orders", subtitle: "Track and manage your customer orders" };
    }
    if (pathname.includes("/supplier/payments")) {
      return { title: "Payments", subtitle: "View your payment history and invoices" };
    }
    if (pathname.includes("/supplier/store-profile")) {
      return { title: "Store Profile", subtitle: "Manage your store details and appearance" };
    }
    if (pathname.includes("/supplier/security")) {
      return { title: "Security", subtitle: "Manage your account security and passwords" };
    }

    return { title: "Dashboard", subtitle: "Welcome to your dashboard" };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm z-10 relative">
      <h1 className="text-[22px] font-bold text-[#2A6592] mb-1">
        {title}
      </h1>
      <p className="text-sm text-[#738496]">
        {subtitle}
      </p>
    </header>
  );
}
