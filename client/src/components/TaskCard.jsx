import {
  CalendarDays,
  Check,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react";

const priorityStyles = {
  low: "bg-sky-50 text-sky-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-rose-50 text-rose-700",
};

function formatDueDate(dateValue) {
  if (!dateValue) return null;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function isOverdue(task) {
  if (!task.dueDate || task.status === "completed") return false;
  const due = new Date(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const completed = task.status === "completed";
  const dueDate = formatDueDate(task.dueDate);

  return (
    <article className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-panel transition-shadow hover:shadow-lg sm:p-6">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => onToggleStatus(task)}
          aria-label={completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`}
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-colors ${
            completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-300 text-transparent hover:border-brand-500"
          }`}
        >
          {completed ? <Check size={14} strokeWidth={3} /> : <Circle size={10} fill="currentColor" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-display text-base font-bold ${completed ? "text-slate-400 line-through" : "text-ink"}`}>
              {task.title}
            </h3>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${priorityStyles[task.priority] || priorityStyles.medium}`}>
              {task.priority || "medium"} priority
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              completed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}>
              {completed ? "Completed" : "Pending"}
            </span>
          </div>
          {task.description && (
            <p className={`mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 ${completed ? "text-slate-400" : "text-muted"}`}>
              {task.description}
            </p>
          )}
          {dueDate && (
            <div className={`mt-4 inline-flex items-center gap-1.5 text-xs font-medium ${
              isOverdue(task) ? "text-rose-600" : "text-slate-500"
            }`}>
              <CalendarDays size={14} aria-hidden="true" />
              {isOverdue(task) ? "Overdue · " : "Due "}
              {dueDate}
            </div>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
          >
            <Pencil size={17} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}
