import { useEffect, useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
};

export default function TaskModal({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState("");
  const editing = Boolean(task);

  useEffect(() => {
    setForm(
      task
        ? {
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "medium",
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
          }
        : emptyForm
    );
  }, [task]);

  function handleSubmit(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setValidationError("A task title is required.");
      return;
    }
    setValidationError("");
    onSave({
      ...form,
      title,
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    });
  }

  function updateField(event) {
    setValidationError("");
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-[2px]"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="my-auto w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600">
              {editing ? "Task details" : "Make it happen"}
            </p>
            <h2 id="task-modal-title" className="font-display mt-2 text-2xl font-extrabold text-ink">
              {editing ? "Edit task" : "Create a task"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {editing ? "Update the details below." : "Add the details and keep your day moving."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-semibold text-ink">
              Task title <span className="text-rose-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={updateField}
              maxLength={120}
              autoFocus
              required
              placeholder="e.g. Prepare project proposal"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-ink">
              Description <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={updateField}
              maxLength={2000}
              rows={3}
              placeholder="Add a few helpful details..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="priority" className="mb-2 block text-sm font-semibold text-ink">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={updateField}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label htmlFor="dueDate" className="mb-2 block text-sm font-semibold text-ink">
                Due date <span className="font-normal text-muted">(optional)</span>
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={updateField}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </div>
          </div>
          {validationError && <p role="alert" className="text-sm font-medium text-rose-600">{validationError}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
