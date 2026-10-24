# Daymark — Task Manager

A responsive task-management dashboard built for the Hammoq Infosystems Pvt. Ltd. MERN Stack Developer assessment. Create, organize, search, update, and complete tasks with a React interface backed by an Express API and MongoDB.

## Features

- Create and edit tasks with a required title, optional description and due date, and low/medium/high priority.
- View tasks in a responsive dashboard with total, pending, and completed counts.
- Search by title and filter by all, pending, or completed status.
- Mark tasks completed or move them back to pending.
- Confirm before deleting a task.
- Inline status and priority badges, overdue date indicators, loading states, and useful empty states.
- Form validation and success/error notifications for API operations.
- Persist task data in MongoDB.

## Technologies

- **Frontend:** React 18, Vite, JavaScript, Tailwind CSS, Axios, Lucide icons
- **Backend:** Node.js, Express 4, Mongoose, dotenv, cors
- **Database:** MongoDB Community Server or MongoDB Atlas

## Prerequisites

- Node.js 18 or newer and npm
- A running MongoDB instance, or a MongoDB Atlas connection string

## Installation and running

Run these commands in PowerShell from the repository root. Start the backend and frontend in separate terminals.

### Terminal 1 — backend

```powershell
cd server
npm install
Copy-Item ..\.env.example .env
# Edit .env and set MONGODB_URI if your MongoDB connection differs.
npm run dev
```

For a production-style start, use `npm start` instead of `npm run dev`.

### Terminal 2 — frontend

```powershell
cd client
npm install
npm run dev
```

Open the Vite URL printed in the frontend terminal (normally `http://localhost:5173`). The Vite development server proxies `/api` requests to `http://localhost:5000`.

## Environment configuration

Copy the root `.env.example` into `server\.env`. Environment files are ignored by Git.

| Variable | Default/example | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | Express API port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/task-manager` | MongoDB connection URI |
| `CORS_ORIGIN` | `http://localhost:5173,http://127.0.0.1:5173` | Comma-separated allowed browser origins |

For local MongoDB, install and start MongoDB Community Server, then keep the example URI. For Atlas, replace it with the connection URI from your cluster and ensure your machine is allowed by the Atlas network access rules. Do not commit the real URI or other credentials.

In development, both `localhost:5173` and `127.0.0.1:5173` are allowed automatically, including when an existing `.env` lists only one of them. Restart the backend after changing its configuration. In production, set `CORS_ORIGIN` to the exact deployed frontend origin(s); other hosts or ports must be explicitly allowed.

The frontend uses the Vite `/api` proxy by default. For a separately hosted API, define `VITE_API_URL` in `client/.env` with the API prefix, for example `https://api.example.com/api`.

## API

All task endpoints are prefixed with `/api`. Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": "..." }`.

| Method | Path | Description | Success |
| --- | --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running | `200` |
| `GET` | `/api/tasks` | List tasks, newest first | `200` |
| `GET` | `/api/tasks/:id` | Get one task | `200` |
| `POST` | `/api/tasks` | Create a task | `201` |
| `PUT` | `/api/tasks/:id` | Update editable task fields | `200` |
| `PATCH` | `/api/tasks/:id/status` | Set status to `pending` or `completed` | `200` |
| `DELETE` | `/api/tasks/:id` | Delete a task | `200` |

Example create body:

```json
{
  "title": "Prepare project proposal",
  "description": "Draft the outline and review estimates.",
  "priority": "high",
  "dueDate": "2026-11-05"
}
```

`title` is required (maximum 120 characters). `description` is optional (maximum 2,000 characters). `priority` defaults to `medium`, `status` defaults to `pending`, and `dueDate` is optional. Invalid IDs and invalid input return `400`; missing tasks return `404`.

For updates, send the task fields being changed; omitted fields are left as they are.

## Screenshots

No screenshots are included in this repository. Run the frontend locally to capture the dashboard and task form.

## Known limitations

- Tasks belong to one shared list; there are no user accounts or access controls.
- Search and status filtering happen in the browser after all tasks are fetched.
- The delete confirmation uses the browser's native confirmation dialog.
- The application requires MongoDB to be available when the API starts.

## Future improvements

- Add authentication and per-user task ownership.
- Add pagination/server-side search for larger task collections.
- Add automated API and browser tests, then CI checks.
- Add reminders, recurring tasks, and deployment configuration.
