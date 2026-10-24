# Assessment notes

## Implementation decisions

1. **Kept the API split into routes, controller functions, model, database setup, and error middleware.** This makes each responsibility easy to find and discuss while keeping the application small enough for an assessment.
2. **Used a dedicated `PATCH /api/tasks/:id/status` endpoint.** A status toggle changes one field and can be validated independently instead of sending unrelated task fields from the UI.
3. **Loaded tasks once and performed title search, status filtering, and summary counts in React.** This keeps the API straightforward and is sufficient for the expected size of a single-user assessment app; server-side query support can be added as the collection grows.

## Deliberately not implemented

1. **Authentication and user accounts:** these were not required, and adding identity flows would expand the assessment scope. The current API treats tasks as one shared list.
2. **Reminders, recurring tasks, and notifications outside the app:** these require scheduling and delivery infrastructure beyond the requested CRUD workflow.
3. **Pagination and server-side search:** for a small assessment task list, the simpler client-side implementation is easier to understand. It is not intended for very large collections.

## Current limitation and one-day improvement

The task collection is shared and has no user-level access control, so every connected client sees and can change the same tasks. With one additional day, add authentication, store an owner ID on each task, scope all database operations to the authenticated user, and cover the authorization boundaries with API tests.
