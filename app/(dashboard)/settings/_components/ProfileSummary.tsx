const profileDetails = [
  ["Name", "Jenny Wilson"],
  ["Bio", "Dedicated natural health advocate committed to empowering people with safe, holistic, and evidence-based wellness guidance. Focused on building meaningful digital experiences that make naturopathic knowledge accessible to everyone worldwide."],
  ["Email", "example@example.com"],
  ["Phone", "+1 (725) 890-4421"],
  ["Location", "87 Meadowbrook Drive, Austin, TX 78703"],
] as const;

export function ProfileSummary() {
  return (
    <aside className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="h-20 bg-gradient-to-br from-[#5F9CB4] to-[#4B9A77]" />
      <div className="px-4 pb-5 text-center">
        <div className="-mt-10 mx-auto grid size-20 place-items-center rounded-full border-4 border-white bg-[#2A6592] text-2xl font-semibold text-white shadow-sm">
          JW
        </div>
        <h2 className="mt-2 text-base font-bold text-[#0B174B]">Welly Wilson</h2>
        <p className="text-xs text-slate-500">example@example.com</p>

        <dl className="mt-5 space-y-3 text-left text-xs leading-relaxed text-slate-700">
          {profileDetails.map(([label, value]) => (
            <div key={label}>
              <dt className="font-semibold text-slate-800">{label}:</dt>
              <dd className="mt-0.5 text-slate-600">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
