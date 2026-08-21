"use client";

import { ChevronDown, KeyRound, UserRound } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  icon: "profile" | "password";
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SettingsSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = `${title.toLowerCase().replace(/\s+/g, "-")}-content`;
  const Icon = icon === "profile" ? UserRound : KeyRound;

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-900">
          <Icon className="size-3.5 text-[#2A6592]" aria-hidden="true" />
          {title}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div id={contentId} className="border-t border-slate-100 p-3 sm:p-5">
          {children}
        </div>
      )}
    </section>
  );
}
