import { ChangePasswordForm } from "./_components/ChangePasswordForm";
import { PersonalInformationForm } from "./_components/PersonalInformationForm";
import { ProfileSummary } from "./_components/ProfileSummary";
import { SettingsSection } from "./_components/SettingsSection";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6">
      <div className="space-y-3">
        <SettingsSection title="Profile" icon="profile" defaultOpen>
          <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
            <ProfileSummary />
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <PersonalInformationForm />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Password" icon="password">
          <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
            <ProfileSummary />
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <ChangePasswordForm />
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
