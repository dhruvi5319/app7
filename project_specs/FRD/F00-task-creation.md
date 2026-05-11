---

## F00: Task Creation

**PRD Reference:** F0 — Priority P0 (Critical / MVP)

**Description:** Task Creation is the primary entry point for capturing work in the application. A user types a task title into a single input field and submits it (via button click or keyboard shortcut). The new task is immediately appended to the task list and persisted to the data store. The interaction is intentionally minimal — no modal, no multi-step form, no required metadata beyond the title.

---

### Terminology

- **Create Input Field:** The dedicated text input element always visible at the top of the task list interface for entering new task titles.
- **Submit Action:** The act of finalizing task creation — either pressing Enter while the input is focused, or clicking the "Add Task" button.
- **Append:** New tasks are added to the end (bottom) of the task list, in insertion order.

---

### Sub-features

- Single-field task title input
- Keyboard shortcut submission (Enter key)
- Button-based submission ("Add Task" or equivalent)
- Immediate list update on successful creation
- Input field clears after successful submission
- Empty/whitespace-only title rejection with inline error feedback
- Persistence of new task to data store

---

### Process

1. The Create Input Field is rendered at the top of the task list view on page load. It is always visible — no button required to reveal it.
2. The user types a task title into the Create Input Field.
3. The user submits via one of:
   - Pressing the **Enter** key while the input is focused, or
   - Clicking the **Add Task** button adjacent to the input.
4. The system validates the input:
   - If the title is empty or whitespace-only → reject with an inline error message; input retains focus; no task is created.
   - If the title exceeds 500 characters → reject with an inline character-limit error; no task is created.
   - Otherwise → proceed.
5. The system generates a new task object:
   - `id`: UUID v4 (generated client-side)
   - `title`: trimmed version of the user's input
   - `completed`: `false`
   - `createdAt`: current timestamp (ISO 8601)
   - `updatedAt`: current timestamp (ISO 8601)
6. The task object is written to the data store (localStorage).
7. The task list re-renders with the new task appended at the bottom.
8. The Create Input Field is cleared and focus is returned to it, ready for the next entry.

---

### Inputs

- `title` (string, required): The user-provided task description. Must be non-empty after trimming. Maximum 500 characters.

---

### Outputs

- **Success:** A new task object is persisted; the task list displays the new item at the bottom; the input field is cleared.
- **Failure (validation):** An inline error message appears below or within the input field; the input value is preserved; no task is created or persisted.

**Created Task Object:**
- `id` (uuid): System-generated unique identifier
- `title` (string): Trimmed input value
- `completed` (boolean): Always `false` at creation
- `createdAt` (ISO8601): Timestamp of creation
- `updatedAt` (ISO8601): Timestamp of last modification (equals `createdAt` at creation)

---

### Validation Rules

- `title` must not be empty after trimming leading/trailing whitespace.
- `title` must not exceed 500 characters (after trimming).
- `title` may contain any Unicode characters including punctuation, emoji, and numbers.
- No deduplication check — identical titles are permitted (tasks are distinguished by ID).

---

### Error States

| Scenario | Error Code | UI Behavior | Message |
|----------|------------|-------------|---------|
| Empty or whitespace-only title submitted | `TITLE_REQUIRED` | Inline error below input; input retains focus | "Task title is required." |
| Title exceeds 500 characters | `TITLE_TOO_LONG` | Inline error below input; input retains focus | "Task title must be 500 characters or fewer." |
| Data store write fails (storage full, etc.) | `STORAGE_WRITE_FAILED` | Toast/banner error; task not added to list | "Could not save task. Storage may be full." |

---

### API Surface (this feature)

| Method | Path | Summary |
|--------|------|---------|
| `POST` | `/api/tasks` | Create a new task |

See `Y1-api.md` §Task Creation for full request/response schema.

---

### Schema Surface (this feature)

Creates a record in the `tasks` collection.
Fields used: `id`, `title`, `completed`, `createdAt`, `updatedAt`.
See `Y0-schema.md` §Tasks for full schema definition.
