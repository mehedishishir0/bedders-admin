"use client";

import { Check, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const passwordRules = [
  "Minimum 8–12 characters (recommend 12+ for stronger security).",
  "At least one uppercase letter must.",
  "At least one lowercase letter must.",
  "At least one number must (0–9).",
  "At least 1 special character (! @ # $ % ^ & * etc.).",
  "No spaces allowed.",
];

export function ChangePasswordForm() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!passwordsMatch) {
      setMessage("New password and confirmation must match.");
      return;
    }
    setMessage("Password saved locally.");
  };

  const handleDiscard = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-[#0B174B]">Changes Password</h2>
        <p className="text-xs text-slate-500">Manage your account preferences, security settings, and privacy options.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <PasswordField label="Current Password" value={currentPassword} onChange={setCurrentPassword} showPassword={showPasswords} onToggleVisibility={() => setShowPasswords((show) => !show)} />
          <PasswordField label="New Password" value={newPassword} onChange={setNewPassword} showPassword={showPasswords} onToggleVisibility={() => setShowPasswords((show) => !show)} />
        </div>
        <PasswordField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} showPassword={showPasswords} onToggleVisibility={() => setShowPasswords((show) => !show)} invalid={confirmPassword.length > 0 && !passwordsMatch} />

        <ul className="space-y-1 pt-1 text-xs text-slate-600">
          {passwordRules.map((rule, index) => {
            const isBlocked = index === passwordRules.length - 1;
            return (
              <li key={rule} className="flex items-start gap-1.5">
                {isBlocked ? <X className="mt-0.5 size-3 text-rose-500" aria-hidden="true" /> : <Check className="mt-0.5 size-3 text-[#0B174B]" aria-hidden="true" />}
                {rule}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {message && <p role="status" className={`mr-auto text-xs ${passwordsMatch ? "text-emerald-700" : "text-rose-600"}`}>{message}</p>}
          <Button type="button" variant="outline" onClick={handleDiscard} className="border-rose-300 text-rose-500 hover:bg-rose-50 hover:text-rose-600">
            Discard Changes
          </Button>
          <Button type="submit" className="bg-[#0B174B] text-white hover:bg-[#16256b]">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
  invalid?: boolean;
}

function PasswordField({ label, value, onChange, showPassword, onToggleVisibility, invalid = false }: PasswordFieldProps) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <span className="relative block">
        <Input type={showPassword ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={invalid} className="h-10 rounded-sm border-slate-200 pr-9 text-sm aria-invalid:border-rose-400" />
        <button type="button" onClick={onToggleVisibility} className="absolute inset-y-0 right-0 grid w-9 place-items-center text-slate-400 hover:text-slate-700" aria-label={showPassword ? "Hide password" : "Show password"}>
          {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </button>
      </span>
    </label>
  );
}
