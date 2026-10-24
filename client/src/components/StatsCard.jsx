import { CheckCheck, CircleDashed, ListTodo } from "lucide-react";

const iconMap = {
  total: ListTodo,
  pending: CircleDashed,
  completed: CheckCheck,
};

const styles = {
  total: "bg-brand-50 text-brand-600",
  pending: "bg-amber-50 text-amber-600",
  completed: "bg-emerald-50 text-emerald-600",
};

export default function StatsCard({ label, value, kind, note }) {
  const Icon = iconMap[kind];

  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-panel sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="font-display mt-3 text-3xl font-bold tracking-tight text-ink">
            {value}
          </p>
        </div>
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${styles[kind]}`}>
          <Icon size={21} strokeWidth={2.1} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-xs text-muted">{note}</p>
    </article>
  );
}
