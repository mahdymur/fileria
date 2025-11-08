import { Checkbox } from "../ui/checkbox";

export function TutorialStep({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <li className="flex gap-4">
      <Checkbox
        id={slug}
        name={slug}
        className="peer mt-2"
      />
      <label
        htmlFor={slug}
        className="flex-1 rounded-2xl border border-emerald-500/15 bg-[#07090a]/85 p-6 text-left shadow-[0_0_45px_rgba(16,185,129,0.12)] transition-all hover:-translate-y-0.5 peer-checked:border-emerald-500/5 peer-checked:opacity-70"
      >
        <span className="text-lg font-semibold text-emerald-50">{title}</span>
        <div className="mt-3 space-y-3 text-sm text-muted-foreground">
          {children}
        </div>
      </label>
    </li>
  );
}
