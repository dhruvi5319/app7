---

## F01: Task List View

**PRD Reference:** F1 — Priority P0 (Critical / MVP)

**Description:** The Task List View is the application's primary and only screen. It displays all tasks stored for the user in a single, scrollable list. Each item shows the task title and its completion status. The list visually differentiates completed tasks from incomplete ones. Data persists across page refreshes — reloading the browser does not cause any tasks to disappear.

---

### Terminology

- **List Item:** A single rendered row in the task list corresponding to one task object.
- **Incomplete Task:** A task with `completed: false`. Rendered in the default (active) visual style.
- **Completed Task:** A task with `completed: true`. Rendered with a distinct visual treatment (e.g., strikethrough, muted/greyed text).
- **Empty State:** The visual treatment shown when no tasks exist in the data store.
- **Insertion Order:** The order tasks appear in the list — oldest first (by `createdAt` ascending), newest at the bottom.

---

### Sub-features

- Render all persisted tasks on page load
- Show task title per list item
- Show completion status indicator (checkbox or equivalent) per list item
- Visual differentiation of completed vs. incomplete tasks
- Scrollable list for large numbers of tasks
- Empty state when no tasks exist
- Data hydration from localStorage on page load (persistence across refresh)

---

### Process

1. On page load (or app initialization), the system reads all task data from the data store (localStorage key: `tasktracker_tasks`).
2. Tasks are deserialized from JSON. If the stored data is malformed or missing, the system initializes with an empty task list (no error shown to user; treated as a fresh start).
3. Tasks are sorted by `createdAt` ascending (oldest first) for display.
4. The task list is rendered. For each task:
   - A completion status indicator (checkbox) is shown, checked if `completed: true`.
   - The task title is displayed.
   - If `completed: true`, the title is visually distinguished (strikethrough + muted color).
   - Action controls (delete button; edit trigger) are available per item (see F03, F04).
5. If no tasks exist, an **Empty State** message is displayed (e.g., "No tasks yet. Add one above.").
6. The Create Input Field (F00) is always rendered at the top, above the list.
7. The list updates reactively whenever tasks are created (F00), completed/toggled (F02), deleted (F03), or edited (F04) — no full page reload required.

---

### Inputs

- **Data store read:** All task objects stored under the localStorage key `tasktracker_tasks`.
- **No user inputs** — this feature is a display/read operation. User interaction triggers other features (F00, F02, F03, F04).

---

### Outputs

- **Rendered task list:** All tasks displayed in insertion order, each showing title and completion status.
- **Empty state message:** Displayed when the tasks array is empty.
- **Visual completion differentiation:** Completed tasks appear visually distinct (strikethrough, muted color, or equivalent).

---

### Validation Rules

- If `tasktracker_tasks` key is absent from localStorage, treat as empty array (no error).
- If stored JSON is invalid/malformed, reset to empty array silently. Do not throw an unhandled error that breaks the app.
- Each task object must have at minimum `id`, `title`, and `completed` fields to render. Tasks missing required fields are skipped/omitted from the rendered list without crashing.
- Display order: always `createdAt` ascending. Tasks without a `createdAt` field sort to the end.

---

### Error States

| Scenario | Error Code | UI Behavior | Message |
|----------|------------|-------------|---------|
| localStorage read throws a SecurityError (private browsing blocked) | `STORAGE_READ_FAILED` | Banner warning; app renders empty list and disables persistence | "Unable to access local storage. Tasks will not be saved." |
| Stored JSON is corrupted/malformed | `STORAGE_CORRUPT` | Silent recovery; app resets to empty list | *(No message shown — treated as fresh start)* |
| No tasks in store | *(not an error)* | Empty state message rendered | "No tasks yet. Add one above." |

---

### API Surface (this feature)

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/api/tasks` | Retrieve all tasks |

See `Y1-api.md` §Task List for full response schema.

---

### Schema Surface (this feature)

Reads all records from the `tasks` collection.
Fields used: `id`, `title`, `completed`, `createdAt`, `updatedAt`.
See `Y0-schema.md` §Tasks for full schema definition.
