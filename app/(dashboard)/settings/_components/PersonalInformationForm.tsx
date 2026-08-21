"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialProfile = {
  firstName: "Welly",
  lastName: "Wilson",
  email: "example@example.com",
  phone: "+1 (555) 123-4567",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi et ante sed sem feugiat tristique at sed mauris. Phasellus urna magna, cursus at mi pulvinar quis porta nisi.",
  streetAddress: "1234 Oak Avenue, San Francisco, CA 94102",
  location: "Florida, USA",
  postalCode: "30301",
};

export function PersonalInformationForm() {
  const [profile, setProfile] = useState(initialProfile);
  const [saved, setSaved] = useState(false);

  const updateField = (field: keyof typeof initialProfile, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handleDiscard = () => {
    setProfile(initialProfile);
    setSaved(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#0B174B]">Personal Information</h2>
        <p className="text-xs text-slate-500">Manage your personal information and profile details.</p>
      </div>

      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <fieldset className="flex items-center gap-4">
          <legend className="text-xs font-medium text-slate-700">Male</legend>
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input defaultChecked name="gender" type="radio" className="accent-[#0B174B]" />
            Male
          </label>
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input name="gender" type="radio" className="accent-[#0B174B]" />
            Female
          </label>
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First Name" value={profile.firstName} onChange={(value) => updateField("firstName", value)} />
          <Field label="Last Name" value={profile.lastName} onChange={(value) => updateField("lastName", value)} />
          <Field label="Email Address" type="email" value={profile.email} onChange={(value) => updateField("email", value)} />
          <Field label="Phone Number" type="tel" value={profile.phone} onChange={(value) => updateField("phone", value)} />
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-700">Bio</span>
          <Textarea
            value={profile.bio}
            onChange={(event) => updateField("bio", event.target.value)}
            className="min-h-24 resize-none rounded-sm border-slate-200 text-sm"
          />
        </label>

        <Field label="Street Address" value={profile.streetAddress} onChange={(value) => updateField("streetAddress", value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Location" value={profile.location} onChange={(value) => updateField("location", value)} />
          <Field label="Postal Code" value={profile.postalCode} onChange={(value) => updateField("postalCode", value)} />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {saved && <p role="status" className="mr-auto text-xs text-emerald-700">Changes saved locally.</p>}
          <Button type="button" variant="outline" onClick={handleDiscard} className="border-rose-300 text-rose-500 hover:bg-rose-50 hover:text-rose-600">
            Discard Changes
          </Button>
          <Button type="submit" className="bg-[#0B174B] text-white hover:bg-[#16256b]">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "email" | "tel" | "text";
}

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-sm border-slate-200 text-sm" />
    </label>
  );
}
