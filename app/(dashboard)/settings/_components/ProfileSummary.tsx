"use client";

import { useRef } from "react";
import { Camera, LoaderCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { CurrentUser } from "./PersonalInformationForm";

type ProfileResponse = { data: CurrentUser };
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

export function ProfileSummary() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: response } = useQuery<ProfileResponse>({
    queryKey: ["current-user-profile"],
    queryFn: async () => {
      const result = await fetch(`${backendUrl}/user/profile`, { headers: { Authorization: `Bearer ${session?.user?.accessToken || ""}` } });
      const data = await result.json().catch(() => ({}));
      if (!result.ok) throw new Error(data.message || "Failed to fetch profile");
      return data;
    },
    enabled: !!session?.user?.accessToken,
  });
  const uploadProfilePicture = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("profilePicture", file);
      const result = await fetch(`${backendUrl}/user/profile`, { method: "PUT", headers: { Authorization: `Bearer ${session?.user?.accessToken || ""}` }, body });
      const data = await result.json().catch(() => ({}));
      if (!result.ok) throw new Error(data.message || "Failed to upload profile picture");
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<ProfileResponse>(["current-user-profile"], data);
      toast.success("Profile picture updated successfully");
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const user = response?.data;
  const initials = user?.fullName?.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "--";
  const details = [["Name", user?.fullName || "Not available"], ["Email", user?.email || "Not available"], ["Phone", user?.phoneNumber || "Not available"], ["Location", [user?.address, user?.city, user?.country].filter(Boolean).join(", ") || "Not available"]];
  const selectProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) uploadProfilePicture.mutate(file); event.target.value = ""; };
  return <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="h-20 bg-gradient-to-br from-[#5F9CB4] to-[#4B9A77]" /><div className="px-4 pb-5 text-center"><input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={selectProfilePicture} /><button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadProfilePicture.isPending} aria-label="Change profile picture" className="-mt-10 relative mx-auto grid size-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#2A6592] text-2xl font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-wait">{user?.profilePicture ? <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : initials}{uploadProfilePicture.isPending && <span className="absolute inset-0 grid place-items-center bg-slate-900/60"><LoaderCircle className="size-6 animate-spin text-white" aria-label="Uploading profile picture" /></span>}{!uploadProfilePicture.isPending && <span className="absolute inset-0 grid place-items-center bg-slate-900/0 text-white opacity-0 transition-colors hover:bg-slate-900/45 hover:opacity-100"><Camera className="size-5" /></span>}</button><h2 className="mt-2 text-base font-bold text-[#0B174B]">{user?.fullName || "Loading..."}</h2><p className="text-xs text-slate-500">{user?.email || ""}</p><dl className="mt-5 space-y-3 text-left text-xs leading-relaxed text-slate-700">{details.map(([label, value]) => <div key={label}><dt className="font-semibold text-slate-800">{label}:</dt><dd className="mt-0.5 text-slate-600">{value}</dd></div>)}</dl></div></aside>;
}
