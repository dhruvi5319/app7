---

## F04: Task Editing

**PRD Reference:** F4 — Priority P1 (High / Active in v1)

**Description:** Task Editing allows users to correct or refine the title of an existing task after it has been created. Editing is done inline within the task list item — clicking or tapping the title (or a dedicated edit icon) activates an editable input directly in the list row, without navigating away or opening a modal. The user confirms with Enter or a save button, or cancels with Escape or a cancel button. Empty titles are rejected on save.

---

### Terminology

- **Edit Mode:** The state of a task list item when its title field has been activated for editing. Only one task may be in Edit Mode at a time.
- **View Mode:** The default (non-editing) display state of a task list item.
- **Inline Edit Input:** The text input rendered within the task list item row when Edit Mode is active, pre-populated with the current title.
- **Confirm Action:** Saving the edited title — triggered by pressing Enter or clicking the Save button.
- **Cancel Action:** Discarding the edit — triggered by pressing Escape or clicking the Cancel button. The task title reverts to its pre-edit value.

---

### Sub-features

- Edit trigger per task item (click title, or dedicated edit icon/button)
- Only one task editable at a time (activating another edit closes the current one, discarding unsaved changes)
- Inline Edit Input pre-populated with current title
- Confirm edited title: Enter key or Save button
- Cancel edit without saving: Escape key or Cancel button
- Empty/whitespace-only title rejected on confirm
- Title character limit (500) enforced on confirm
- `updatedAt` timestamp refreshed on successful save
- Persistence of updated title to data store

---

### Process

1. Each task list item renders in **View Mode** by default, showing the task title as static text with an edit trigger (e.g., a pencil icon, or the title itself is clickable).
2. The user activates editing by clicking/tapping the edit trigger on a task item.
3. The task list item transitions to **Edit Mode**:
   - The task title is replaced by an **Inline Edit Input** pre-populated with the current title.
   - The cursor is placed at the end of the pre-populated text.
   - A Save button and a Cancel button are shown adjacent to the input.
   - If another task was already in Edit Mode, it silently reverts to View Mode (unsaved changes to the other task are discarded).
4. The user modifies the text in the Inline Edit Input.
5. The user **confirms** (Enter key or Save button click):
   - The system validates the input:
     - If empty or whitespace-only → reject with inline error; remain in Edit Mode; input retains focus.
     - If exceeds 500 characters → reject with inline character-limit error; remain in Edit Mode; input retains focus.
     - Otherwise → proceed.
   - The task object is updated:
     - `title`: trimmed version of the new input
     - `updatedAt`: current timestamp (ISO 8601)
   - The updated task is written to the data store (localStorage).
   - The task list item transitions back to **View Mode**, displaying the new title.
6. The user **cancels** (Escape key or Cancel button click):
   - No changes are made to the task object or data store.
   - The task list item transitions back to **View Mode**, displaying the original (pre-edit) title.
7. If the user clicks outside the Inline Edit Input (blur event) without explicitly confirming:
   - Treated as a **cancel** — changes are discarded; task reverts to View Mode.

---

### Inputs

- `taskId` (uuid, required): Identifies which task to edit. Derived from the task list item's DOM context.
- `title` (string, required): The new task title provided by the user in the Inline Edit Input. Must be non-empty after trimming. Maximum 500 characters.

---

### Outputs

- **Success (confirm):** Task's `title` and `updatedAt` are updated; task list item transitions to View Mode displaying the new title.
- **Failure (validation on confirm):** Inline error message shown; task remains in Edit Mode; no changes to data store.
- **Cancel:** No changes to task or data store; task returns to View Mode with original title.

**Updated Task Object fields (on success):**
- `title` (string): New trimmed title value
- `updatedAt` (ISO8601): New timestamp of modification

---

### Validation Rules

- `title` must not be empty after trimming leading/trailing whitespace.
- `title` must not exceed 500 characters (after trimming).
- Only one task may be in Edit Mode at a time.
- A task may be edited regardless of its `completed` status (editing a completed task does not change its `completed` status).
- If the user confirms with a title identical to the current title, no write to the data store is required (no-op), but the UI transitions back to View Mode gracefully.
- Blur (clicking outside) without confirmation = cancel (discard changes).

---

### Error States

| Scenario | Error Code | UI Behavior | Message |
|----------|------------|-------------|---------|
| Empty or whitespace-only title on confirm | `TITLE_REQUIRED` | Inline error below input; remain in Edit Mode; input retains focus | "Task title is required." |
| Title exceeds 500 characters on confirm | `TITLE_TOO_LONG` | Inline error below input; remain in Edit Mode; input retains focus | "Task title must be 500 characters or fewer." |
| Task not found in data store on confirm (stale ID) | `TASK_NOT_FOUND` | Exit Edit Mode; remove stale item from list; show toast | "Task not found. It may have been deleted." |
| Data store write fails on confirm | `STORAGE_WRITE_FAILED` | Remain in Edit Mode; show toast error | "Could not save changes. Please try again." |

---

### API Surface (this feature)

| Method | Path | Summary |
|--------|------|---------|
| `PATCH` | `/api/tasks/:id` | Update task title (and/or completion status) |

See `Y1-api.md` §Task Editing for full request/response schema.

---

### Schema Surface (this feature)

Updates a record in the `tasks` collection.
Fields modified: `title`, `updatedAt`.
See `Y0-schema.md` §Tasks for full schema definition.
