import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ClipboardList,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import StatsCard from "./components/StatsCard.jsx";
import TaskCard from "./components/TaskCard.jsx";
import TaskModal from "./components/TaskModal.jsx";
import {
  createTask,
  deleteTask,
  fetchTasks,
  getErrorMessage,
  updateTask,
  updateTaskStatus,
} from "./services/taskService.js";

const filters = [
  { value: "all", label: "All tasks" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  const success = toast.type === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={success ? "status" : "alert"}
      className={`fixed right-4 top-4 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl sm:right-6 sm:top-6 ${
        success ? "border-emerald-100 bg-white text-emerald-800" : "border-rose-100 bg-white text-rose-800"
      }`}
    >
      <Icon className={`mt-0.5 shrink-0 ${success ? "text-emerald-500" : "text-rose-500"}`} size={19} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={onDismiss} aria-label="Dismiss notification" className="text-slate-400 hover:text-ink">
        <X size={17} />
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-100 bg-white">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
      <p className="text-sm font-medium text-muted">Loading your tasks...</p>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [modalTask, setModalTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState("");
  const [toast, setToast] = useState(null);

  async function loadTasks() {
    setLoading(true);
    setLoadError("");
    try {
      setTasks(await fetchTasks());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function loadInitialTasks() {
      try {
        const result = await fetchTasks();
        if (active) setTasks(result);
      } catch (error) {
        if (active) setLoadError(getErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadInitialTasks();
    return () => {
      active = false;
    };
  }, []);

  function notify(message, type = "success") {
    setToast({ id: Date.now(), message, type });
    window.setTimeout(() => setToast(null), 4200);
  }

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter;
      const matchesSearch = !normalizedQuery || task.title.toLowerCase().includes(normalizedQuery);
      return matchesFilter && matchesSearch;
    });
  }, [tasks, filter, query]);

  function openCreateModal() {
    setModalTask(null);
    setModalOpen(true);
  }

  function openEditModal(task) {
    setModalTask(task);
    setModalOpen(true);
  }

  async function handleSave(values) {
    setSaving(true);
    try {
      if (modalTask) {
        const updated = await updateTask(modalTask._id, values);
        setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
        notify("Your task was updated.");
      } else {
        const created = await createTask(values);
        setTasks((current) => [created, ...current]);
        notify("Task created. Nice work!");
      }
      setModalOpen(false);
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(task) {
    setBusyTaskId(task._id);
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const updated = await updateTaskStatus(task._id, nextStatus);
      setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      notify(nextStatus === "completed" ? "Task marked as completed." : "Task moved back to pending.");
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setBusyTaskId("");
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"? This action cannot be undone.`)) return;
    setBusyTaskId(task._id);
    try {
      await deleteTask(task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
      notify("Task deleted.");
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setBusyTaskId("");
    }
  }

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-[246px] flex-col border-r border-slate-200/80 bg-white px-5 py-7 lg:flex">
        <a href="#" className="flex items-center gap-3 px-2" aria-label="Daymark home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Check size={22} strokeWidth={3} />
          </span>
          <span>
            <span className="font-display block text-lg font-extrabold tracking-tight text-ink">daymark</span>
            <span className="-mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">make today count</span>
          </span>
        </a>
        <nav aria-label="Main navigation" className="mt-12">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className="mt-3 flex w-full items-center gap-3 rounded-xl bg-brand-50 px-3 py-3 text-left text-sm font-bold text-brand-700"
          >
            <ClipboardList size={18} />
            My tasks
            <span className="ml-auto rounded-md bg-white px-2 py-0.5 text-xs text-brand-600">{tasks.length}</span>
          </button>
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-50 p-4">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">
            <Sparkles size={18} />
          </div>
          <p className="mt-3 text-sm font-bold text-ink">One step at a time</p>
          <p className="mt-1 text-xs leading-5 text-muted">Focus on what matters. The rest can wait.</p>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">DM</div>
          <div>
            <p className="text-xs font-bold text-ink">Daily workspace</p>
            <p className="text-[11px] text-muted">Personal account</p>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:pl-[246px]">
        <header className="border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                <Check size={20} strokeWidth={3} />
              </span>
              <span className="font-display text-lg font-extrabold">daymark</span>
            </div>
            <p className="hidden text-sm text-muted sm:block">
              Your personal space to plan and get things done.
            </p>
            <button
              type="button"
              onClick={openCreateModal}
              className="ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-600/20 transition-colors hover:bg-brand-700 sm:px-5"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Add task</span>
              <span className="sm:hidden">New task</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-10">
          <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-brand-600">Your workspace</p>
              <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Good things, in progress.</h1>
              <p className="mt-2 text-sm text-muted sm:text-base">A little progress each day adds up to big results.</p>
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 shadow-sm sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Your focus, organized
            </div>
          </section>

          <section aria-label="Task statistics" className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatsCard label="Total tasks" value={tasks.length} kind="total" note="Everything on your list" />
            <StatsCard label="Pending tasks" value={pendingCount} kind="pending" note="Ready when you are" />
            <StatsCard label="Completed tasks" value={completedCount} kind="completed" note="Look at you go!" />
          </section>

          <section aria-labelledby="task-list-title">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 id="task-list-title" className="font-display text-xl font-extrabold text-ink">Your tasks</h2>
                  <p className="mt-1 text-sm text-muted">
                    {visibleTasks.length} {visibleTasks.length === 1 ? "task" : "tasks"} to show
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50 lg:hidden"
                >
                  <Plus size={17} /> Add
                </button>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="relative block sm:min-w-[250px]">
                  <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search tasks..."
                    aria-label="Search tasks by title"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  />
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="Filter tasks">
                  {filters.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFilter(option.value)}
                      aria-pressed={filter === option.value}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:flex-none ${
                        filter === option.value
                          ? "bg-brand-600 text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50 hover:text-ink"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingState />
            ) : loadError ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-rose-100 bg-white px-6 text-center">
                <AlertCircle size={28} className="text-rose-500" />
                <h3 className="mt-3 font-display font-bold text-ink">We couldn&apos;t load your tasks</h3>
                <p className="mt-1 max-w-md text-sm text-muted">{loadError}</p>
                <button
                  type="button"
                  onClick={loadTasks}
                  className="mt-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Try again
                </button>
              </div>
            ) : visibleTasks.length > 0 ? (
              <div className="space-y-3">
                {visibleTasks.map((task) => (
                  <div key={task._id} className={busyTaskId === task._id ? "pointer-events-none opacity-60" : ""}>
                    <TaskCard
                      task={task}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  {query || filter !== "all" ? <Search size={23} /> : <ClipboardList size={23} />}
                </span>
                <h3 className="font-display mt-4 text-base font-bold text-ink">
                  {query || filter !== "all" ? "No tasks match this view" : "Your list is a blank canvas"}
                </h3>
                <p className="mt-1 max-w-sm text-sm leading-6 text-muted">
                  {query || filter !== "all"
                    ? "Try a different search or filter to find what you’re looking for."
                    : "Add your first task and make a little room for progress."}
                </p>
                {!query && filter === "all" && (
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
                  >
                    <Plus size={17} /> Create your first task
                  </button>
                )}
              </div>
            )}
          </section>
          <footer className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Sparkles size={13} />
            Small steps. Meaningful days.
          </footer>
        </div>
      </main>

      {modalOpen && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          saving={saving}
        />
      )}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
