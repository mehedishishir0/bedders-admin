"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface CurrentUser { _id: string; fullName: string; email: string; gender?: "male" | "female"; phoneNumber?: string; country?: string; city?: string; address?: string; profilePicture?: string; role?: string; }
type ProfileResponse = { data: CurrentUser };
type ProfileFormValues = { fullName: string; email: string; gender: "male" | "female" | ""; phoneNumber: string; address: string; city: string; country: string; };
const emptyProfile: ProfileFormValues = { fullName: "", email: "", gender: "", phoneNumber: "", address: "", city: "", country: "" };
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api/v1";

const toFormValues = (user: CurrentUser): ProfileFormValues => ({ fullName: user.fullName || "", email: user.email || "", gender: user.gender || "", phoneNumber: user.phoneNumber || "", address: user.address || "", city: user.city || "", country: user.country || "" });

export function PersonalInformationForm() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [editedProfile, setEditedProfile] = useState<ProfileFormValues | null>(null);
  const { data: profileResponse, isLoading, isError } = useQuery<ProfileResponse>({ queryKey: ["current-user-profile"], queryFn: async () => { const response = await fetch(`${backendUrl}/user/profile`, { headers: { Authorization: `Bearer ${session?.user?.accessToken || ""}` } }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || "Failed to fetch profile"); return data; }, enabled: !!session?.user?.accessToken });
  const profile = editedProfile || (profileResponse?.data ? toFormValues(profileResponse.data) : emptyProfile);
  const updateProfile = useMutation({ mutationFn: async (values: ProfileFormValues) => { const body = new FormData(); body.append("fullName", values.fullName); body.append("email", values.email); body.append("phoneNumber", values.phoneNumber); body.append("address", values.address); body.append("city", values.city); body.append("country", values.country); if (values.gender) body.append("gender", values.gender); const response = await fetch(`${backendUrl}/user/profile`, { method: "PUT", headers: { Authorization: `Bearer ${session?.user?.accessToken || ""}` }, body }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || "Failed to update profile"); return data; }, onSuccess: (data) => { queryClient.setQueryData<ProfileResponse>(["current-user-profile"], data); setEditedProfile(null); toast.success("Profile updated successfully"); }, onError: (error: Error) => toast.error(error.message) });
  const updateField = (field: keyof ProfileFormValues, value: string) => setEditedProfile((current) => ({ ...(current || profile), [field]: value }));
  const handleDiscard = () => setEditedProfile(null);
  if (isLoading) return <div className="py-8 text-center text-sm text-slate-500">Loading profile...</div>;
  if (isError) return <div className="py-8 text-center text-sm text-rose-600">Could not load profile information.</div>;
  return <div className="space-y-4"><div><h2 className="text-lg font-bold text-[#0B174B]">Personal Information</h2><p className="text-xs text-slate-500">Manage your personal information and profile details.</p></div><form className="space-y-3" onSubmit={(event) => { event.preventDefault(); updateProfile.mutate(profile); }}><fieldset className="flex items-center gap-4"><legend className="text-xs font-medium text-slate-700">Gender</legend><label className="flex items-center gap-1.5 text-xs text-slate-600"><input checked={profile.gender === "male"} onChange={() => updateField("gender", "male")} name="gender" type="radio" className="accent-[#0B174B]" />Male</label><label className="flex items-center gap-1.5 text-xs text-slate-600"><input checked={profile.gender === "female"} onChange={() => updateField("gender", "female")} name="gender" type="radio" className="accent-[#0B174B]" />Female</label></fieldset><div className="grid gap-3 sm:grid-cols-2"><Field label="Full Name" value={profile.fullName} onChange={(value) => updateField("fullName", value)} /><Field label="Email Address" type="email" value={profile.email} onChange={(value) => updateField("email", value)} /><Field label="Phone Number" type="tel" value={profile.phoneNumber} onChange={(value) => updateField("phoneNumber", value)} /><Field label="Country" value={profile.country} onChange={(value) => updateField("country", value)} /></div><Field label="Street Address" value={profile.address} onChange={(value) => updateField("address", value)} /><div className="grid gap-3 sm:grid-cols-2"><Field label="City" value={profile.city} onChange={(value) => updateField("city", value)} /></div><div className="flex flex-wrap items-center justify-end gap-3 pt-2"><Button type="button" variant="outline" onClick={handleDiscard} disabled={updateProfile.isPending} className="border-rose-300 text-rose-500 hover:bg-rose-50 hover:text-rose-600">Discard Changes</Button><Button type="submit" disabled={updateProfile.isPending} className="bg-[#0B174B] text-white hover:bg-[#16256b]">{updateProfile.isPending ? "Saving..." : "Save Changes"}</Button></div></form></div>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: "email" | "tel" | "text" }) { return <label className="block space-y-1"><span className="text-xs font-medium text-slate-700">{label}</span><Input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-sm border-slate-200 text-sm" /></label>; }
