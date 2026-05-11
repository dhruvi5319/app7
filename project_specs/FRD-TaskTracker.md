# FRD: Task Tracker App

**Project:** TaskTracker
**Version:** 1.0
**Date:** 2026-05-11
**Status:** Draft
**Based on PRD:** PRD-TaskTracker.md v1.0

---

## Scope Statement

This Functional Requirements Document specifies the complete behavioral contract for TaskTracker v1 — a lightweight, single-user, browser-based task management application. It covers five features (F00–F04) delivering task creation, list view, completion toggling, deletion, and title editing. No authentication, no server-side user accounts, and no team/collaboration features are in scope for v1. All persistence is handled client-side (localStorage or equivalent browser storage).

---

## Conventions

- **Feature IDs** follow the format `F{nn}` (zero-padded), matching PRD feature numbers. F00 = PRD F0, F01 = PRD F1, etc.
- **Field types** use TypeScript-style notation: `string`, `boolean`, `number`, `ISO8601` (date string), `uuid` (string UUID v4).
- **API surface** in each feature chunk is a summary. Full request/response schemas live in `Y1-api.md`.
- **Schema surface** in each feature chunk is a summary. Full DDL/structure lives in `Y0-schema.md`.
- **Error codes** are `SCREAMING_SNAKE_CASE` strings returned in the API error response body.
- **HTTP status codes** follow REST conventions (200, 201, 400, 404, 422, 500).
- **"Immediate"** means UI updates optimistically without waiting for storage confirmation; storage is synchronous for localStorage.
- **P0** = Critical MVP requirement. **P1** = High priority, included in v1 active scope.

---

## Table of Contents

| Section | File | Feature |
|---------|------|---------|
| F00 | `F00-task-creation.md` | Task Creation |
| F01 | `F01-task-list-view.md` | Task List View |
| F02 | `F02-task-completion.md` | Task Completion |
| F03 | `F03-task-deletion.md` | Task Deletion |
| F04 | `F04-task-editing.md` | Task Editing |
| Y0 | `Y0-schema.md` | Database / Storage Schema |
| Y1 | `Y1-api.md` | REST API Endpoints |
| Y2 | `Y2-errors.md` | Cross-Feature Error Catalog |
| Y3 | `Y3-integrations.md` | Integration Points |

---

## Cross-Cutting Terminology

- **Task:** The core unit of data in the application. A task has a title, a completion status, and system-generated metadata (ID, timestamps).
- **Task ID:** A UUID v4 string that uniquely identifies a task within the user's data store. Generated at creation time; never changes.
- **Task Title:** A non-empty string provided by the user describing the work to be done. Maximum 500 characters.
- **Completion Status:** A boolean flag (`completed: true/false`) indicating whether the task has been marked done.
- **Task List:** The ordered collection of all tasks stored for the user, rendered as the application's primary view.
- **Data Store:** The browser's `localStorage` (or IndexedDB as a fallback). There is no remote database in v1.
- **Inline Editing:** Editing that occurs directly within the list item UI, without navigating away or opening a modal.
- **Optimistic UI Update:** The UI reflects the result of an action immediately, before confirming the data write; for synchronous localStorage, writes complete before re-render.
- **Persist / Persistence:** Writing task state to the data store such that it survives a full page reload.
- **Client-Side API:** For v1, all "API" operations are JavaScript functions operating on localStorage. The API surface described in `Y1-api.md` represents the logical interface contract (callable as REST endpoints if a backend is added later, or as JS module functions in the v1 client-only implementation).

---

*FRD generated: 2026-05-11 | Project: TaskTracker | Version: 1.0*
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
---

## F02: Task Completion

**PRD Reference:** F2 — Priority P0 (Critical / MVP)

**Description:** Task Completion allows users to toggle any task between incomplete and complete states. It is the core "done" action — providing the satisfying closure of checking off finished work. The toggle is reversible: a mistakenly completed task can be unchecked. Visual feedback is immediate upon interaction, with no page reload required.

---

### Terminology

- **Toggle:** The act of switching `completed` from `false` → `true`, or from `true` → `false`, in a single interaction.
- **Completion Indicator:** The UI control (checkbox or equivalent) that represents and controls the task's `completed` state.
- **Strikethrough Style:** The visual treatment applied to completed task titles — text with a line through it, optionally with muted/greyed color.

---

### Sub-features

- Checkbox (or equivalent) per task item reflecting current `completed` state
- Click/tap on indicator toggles `completed` status
- UI updates immediately on toggle (no page reload)
- Persists updated `completed` status and `updatedAt` timestamp to data store
- Visual style switches: incomplete → strikethrough+muted (on complete); strikethrough+muted → normal (on uncomplete)

---

### Process

1. Each task in the Task List View (F01) renders a completion indicator (checkbox).
   - Checkbox is **checked** if `completed: true`.
   - Checkbox is **unchecked** if `completed: false`.
2. The user clicks or taps the completion indicator.
3. The system immediately toggles the visual state of the indicator and the task title styling (optimistic update).
4. The system updates the task object:
   - `completed`: flipped boolean value (`true` → `false` or `false` → `true`)
   - `updatedAt`: current timestamp (ISO 8601)
5. The updated task object is written to the data store (localStorage).
6. The task list item re-renders with the updated styling:
   - **Newly completed:** title gains strikethrough and muted color; checkbox appears checked.
   - **Newly uncompleted:** title returns to normal style; checkbox appears unchecked.
7. No task reordering occurs on toggle — tasks remain in insertion order regardless of completion state.

---

### Inputs

- `taskId` (uuid, required): Identifies which task to toggle. Derived from the task list item's DOM context (not user-entered).
- *(No explicit user-typed input — the toggle is a single click/tap action.)*

---

### Outputs

- **Success:** Task's `completed` field is flipped; `updatedAt` is updated; UI reflects new state immediately.
- **Failure:** Task state is not changed; UI reverts to pre-toggle state (if optimistic update was applied); error message shown.

**Updated Task Object fields:**
- `completed` (boolean): Flipped value
- `updatedAt` (ISO8601): New timestamp of modification

---

### Validation Rules

- The `taskId` must correspond to an existing task in the data store. (Stale DOM references after a race condition are handled gracefully — see Error States.)
- No restrictions on toggling based on completion state — both `true→false` and `false→true` are always permitted.
- `updatedAt` is always refreshed on a successful toggle, even if `completed` toggles back to its original value.

---

### Error States

| Scenario | Error Code | UI Behavior | Message |
|----------|------------|-------------|---------|
| Task not found in data store (stale ID) | `TASK_NOT_FOUND` | Revert optimistic UI update; remove stale item from list | "Task not found. It may have been deleted." |
| Data store write fails | `STORAGE_WRITE_FAILED` | Revert optimistic UI update; show toast error | "Could not update task. Changes were not saved." |

---

### API Surface (this feature)

| Method | Path | Summary |
|--------|------|---------|
| `PATCH` | `/api/tasks/:id` | Toggle task completion status |

See `Y1-api.md` §Task Completion for full request/response schema.

---

### Schema Surface (this feature)

Updates a record in the `tasks` collection.
Fields modified: `completed`, `updatedAt`.
See `Y0-schema.md` §Tasks for full schema definition.
---

## F03: Task Deletion

**PRD Reference:** F3 — Priority P0 (Critical / MVP)

**Description:** Task Deletion allows users to permanently remove any task from their list. This covers tasks created in error, tasks that are no longer relevant, or completed tasks the user wants to clear away. Deletion is immediate and irreversible in v1 — no confirmation dialog is required, and there is no undo mechanism (these are intentional scope decisions to preserve simplicity; undo may be added post-v1).

---

### Terminology

- **Delete Action:** The UI control (button, icon, or swipe gesture) that initiates task deletion for a specific list item.
- **Permanent Removal:** The task record is fully removed from the data store and cannot be recovered through the application UI.

---

### Sub-features

- Delete control available on each task list item
- Single-click/tap deletion (no confirmation dialog in v1)
- Task removed immediately from the rendered list
- Task record removed from data store
- No undo mechanism in v1

---

### Process

1. Each task in the Task List View (F01) renders a delete control (e.g., a trash icon button or "Delete" label button).
2. The user clicks or taps the delete control for a specific task.
3. **No confirmation dialog is shown.** Deletion proceeds immediately.
4. The system removes the task item from the rendered list immediately (optimistic update).
5. The system removes the task record from the data store (localStorage):
   - Reads the full tasks array from localStorage.
   - Filters out the task with the matching `id`.
   - Writes the updated array back to localStorage.
6. The task list re-renders without the deleted item.
7. If the deleted task was the last remaining task, the Empty State is displayed (see F01).

---

### Inputs

- `taskId` (uuid, required): Identifies which task to delete. Derived from the task list item's DOM context (not user-entered).
- *(No explicit user-typed input — deletion is a single click/tap action with no confirmation.)*

---

### Outputs

- **Success:** Task is removed from both the rendered list and the data store. List re-renders; empty state appears if list is now empty.
- **Failure:** Task is not removed; list reverts to pre-deletion state (if optimistic update was applied); error message shown.

---

### Validation Rules

- The `taskId` must correspond to an existing task in the data store. (Stale DOM references handled gracefully — see Error States.)
- Any task may be deleted regardless of its `completed` status.
- No batch deletion in v1 — only one task deleted per action.

---

### Error States

| Scenario | Error Code | UI Behavior | Message |
|----------|------------|-------------|---------|
| Task not found in data store (stale ID) | `TASK_NOT_FOUND` | Remove item from rendered list silently (it's already gone) | *(No message — treat as already deleted)* |
| Data store write fails during deletion | `STORAGE_WRITE_FAILED` | Revert optimistic removal; re-add task to list; show toast error | "Could not delete task. Please try again." |

---

### API Surface (this feature)

| Method | Path | Summary |
|--------|------|---------|
| `DELETE` | `/api/tasks/:id` | Delete a task permanently |

See `Y1-api.md` §Task Deletion for full request/response schema.

---

### Schema Surface (this feature)

Removes a record from the `tasks` collection by `id`.
See `Y0-schema.md` §Tasks for full schema definition.
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
---

## Y0: Database / Storage Schema

**Storage mechanism:** Browser `localStorage` (v1). All task data is stored as a JSON-serialized array under a single localStorage key. If a server-side backend is added in a future version, this schema maps directly to a SQL or NoSQL table/collection.

---

### localStorage Key

| Key | Value Type | Description |
|-----|-----------|-------------|
| `tasktracker_tasks` | JSON string (array of Task objects) | The complete ordered list of all tasks |

**Example raw localStorage value:**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T09:00:00.000Z"
  },
  {
    "id": "3c162b5f-7a3e-4b5d-9f1a-2d8e0f4c6a11",
    "title": "Write weekly report",
    "completed": true,
    "createdAt": "2026-05-11T10:30:00.000Z",
    "updatedAt": "2026-05-11T14:15:00.000Z"
  }
]
```

---

### Task Object Schema

#### TypeScript Interface

```typescript
interface Task {
  id: string;          // UUID v4 — unique identifier, generated at creation
  title: string;       // Non-empty string, max 500 chars, trimmed
  completed: boolean;  // false = incomplete, true = complete
  createdAt: string;   // ISO 8601 datetime string (e.g. "2026-05-11T09:00:00.000Z")
  updatedAt: string;   // ISO 8601 datetime string — updated on every mutation
}
```

#### Field Specifications

| Field | Type | Required | Constraints | Set By | Mutated By |
|-------|------|----------|-------------|--------|------------|
| `id` | `string` (UUID v4) | Yes | Unique, immutable after creation, never null | System (F00) | Never |
| `title` | `string` | Yes | Non-empty after trim; max 500 chars | User (F00) | User (F04) |
| `completed` | `boolean` | Yes | `true` or `false` only; default `false` | System (F00) | User (F02) |
| `createdAt` | `string` (ISO 8601) | Yes | Set at creation; immutable | System (F00) | Never |
| `updatedAt` | `string` (ISO 8601) | Yes | Set at creation; refreshed on every mutation | System (F00) | System (F02, F04) |

---

### Relational DDL (Future Backend Reference)

If a SQL backend is introduced post-v1, the equivalent schema is:

```sql
-- tasks table
CREATE TABLE tasks (
    id          VARCHAR(36)   PRIMARY KEY,           -- UUID v4
    title       VARCHAR(500)  NOT NULL,              -- Task title, trimmed, non-empty
    completed   BOOLEAN       NOT NULL DEFAULT FALSE, -- Completion status
    created_at  TIMESTAMP     NOT NULL,              -- Creation time (UTC)
    updated_at  TIMESTAMP     NOT NULL               -- Last modification time (UTC)
);

-- Index for default sort order
CREATE INDEX idx_tasks_created_at ON tasks (created_at ASC);
```

---

### Data Integrity Rules

- The stored array must always be a valid JSON array. An empty task list is stored as `[]`, not `null` or an absent key.
- Task `id` values within the array must be unique. If a duplicate is detected on read, the first occurrence is retained and subsequent duplicates are discarded.
- The array is written in full on every mutation (read → modify → write). Partial writes are not supported in localStorage.
- On read failure (parse error, SecurityError), the app initializes with an empty array and optionally surfaces a warning (see F01 Error States).

---

### Storage Size Considerations

- localStorage is limited to approximately 5–10 MB per origin (browser-dependent).
- Each task object is approximately 200–300 bytes serialized.
- Theoretical capacity: ~20,000–50,000 tasks before approaching storage limits.
- No automatic pruning is implemented in v1. Storage-full errors surface as `STORAGE_WRITE_FAILED` (see `Y2-errors.md`).
---

## Y1: API Endpoints

**Note on v1 Architecture:** TaskTracker v1 is a client-only application with no backend server. All "API" operations are implemented as JavaScript module functions operating on localStorage. The endpoints below represent the **logical interface contract** — they specify the exact inputs, outputs, and error behaviors that the client-side implementation must honour, and they are defined in REST form so that a backend can be introduced in a future version without changing the feature contracts.

**Base path (v1 client):** Functions exported from `src/api/tasks.js` (or equivalent).
**Base path (future server):** `https://{host}/api`

---

### Authentication

None. v1 is single-user with no authentication.

---

### Common Response Format

**Success:**
```json
{
  "data": { ... }
}
```

**Error:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message."
  }
}
```

---

### §Task List — GET /api/tasks

Retrieve all tasks, sorted by `createdAt` ascending.

**Request:**
- Method: `GET`
- Path: `/api/tasks`
- Body: None
- Query params: None (filtering/sorting deferred to post-v1)

**Response — 200 OK:**
```json
{
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2026-05-11T09:00:00.000Z",
      "updatedAt": "2026-05-11T09:00:00.000Z"
    }
  ]
}
```
- Returns an empty array `[]` when no tasks exist (not a 404).

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 500 | `STORAGE_READ_FAILED` | localStorage read throws an exception |

---

### §Task Creation — POST /api/tasks

Create a new task.

**Request:**
- Method: `POST`
- Path: `/api/tasks`
- Content-Type: `application/json`
- Body:
```json
{
  "title": "Buy groceries"
}
```

**Field Constraints:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | Non-empty after trim; max 500 chars |

**Response — 201 Created:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T09:00:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 422 | `TITLE_REQUIRED` | `title` is absent, empty, or whitespace-only after trim |
| 422 | `TITLE_TOO_LONG` | `title` exceeds 500 characters after trim |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails (storage full, SecurityError) |

---

### §Task Completion — PATCH /api/tasks/:id (toggle completed)

Toggle the completion status of a task.

**Request:**
- Method: `PATCH`
- Path: `/api/tasks/:id`
- Content-Type: `application/json`
- Body:
```json
{
  "completed": true
}
```

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Body Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `completed` | boolean | Yes | `true` or `false` |

**Response — 200 OK:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries",
    "completed": true,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T14:00:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists |
| 422 | `INVALID_FIELD` | `completed` is not a boolean |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails |

---

### §Task Editing — PATCH /api/tasks/:id (update title)

Update the title of an existing task. Uses the same endpoint as §Task Completion — the body determines which fields are updated.

**Request:**
- Method: `PATCH`
- Path: `/api/tasks/:id`
- Content-Type: `application/json`
- Body:
```json
{
  "title": "Buy groceries and cook dinner"
}
```

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Body Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes (for edit) | Non-empty after trim; max 500 chars |

**Response — 200 OK:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries and cook dinner",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists |
| 422 | `TITLE_REQUIRED` | `title` is present in body but empty or whitespace-only after trim |
| 422 | `TITLE_TOO_LONG` | `title` exceeds 500 characters after trim |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails |

---

### §Task Deletion — DELETE /api/tasks/:id

Permanently delete a task.

**Request:**
- Method: `DELETE`
- Path: `/api/tasks/:id`
- Body: None

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Response — 204 No Content:**
- Body: Empty

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists (optional — see note) |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails |

> **Note on 404 for DELETE:** If the task is already absent (stale ID), the v1 client treats this as a silent success (idempotent delete). A future server-side implementation may return 404 strictly.

---

### PATCH Endpoint Behavior — Partial Update Rules

The `PATCH /api/tasks/:id` endpoint accepts partial updates. Only fields present in the request body are modified. Fields absent from the body are left unchanged.

| Body contains | Effect |
|--------------|--------|
| `{ "completed": true }` | Updates `completed` only + refreshes `updatedAt` |
| `{ "title": "New title" }` | Updates `title` only + refreshes `updatedAt` |
| `{ "title": "New title", "completed": true }` | Updates both fields + refreshes `updatedAt` |
| `{}` (empty body) | No-op; returns 200 with unchanged task |

Fields `id`, `createdAt` are immutable and are ignored if included in a PATCH body.
---

## Y2: Cross-Feature Error Catalog

This catalog consolidates all error codes used across TaskTracker v1 features. Each entry specifies the HTTP status code (for future backend use), the triggering condition, the UI behavior, and the user-facing message.

---

### Error Code Reference

| Error Code | HTTP Status | Feature(s) | Condition | UI Behavior | User-Facing Message |
|------------|-------------|------------|-----------|-------------|---------------------|
| `TITLE_REQUIRED` | 422 | F00, F04 | `title` field is absent, empty string, or whitespace-only after trim | Inline error below/within the input field; input retains focus; no data mutation | "Task title is required." |
| `TITLE_TOO_LONG` | 422 | F00, F04 | `title` exceeds 500 characters after trim | Inline error below/within the input field; input retains focus; no data mutation | "Task title must be 500 characters or fewer." |
| `TASK_NOT_FOUND` | 404 | F02, F03, F04 | The target task `id` does not exist in the data store (stale DOM reference or concurrent deletion) | Remove stale item from the rendered list; show toast notification if the user explicitly triggered the action | "Task not found. It may have been deleted." |
| `STORAGE_READ_FAILED` | 500 | F01 | `localStorage.getItem()` throws a `SecurityError` or equivalent (e.g., private browsing mode blocks storage) | Render empty list with a persistent banner warning; disable all write actions | "Unable to access local storage. Tasks will not be saved." |
| `STORAGE_WRITE_FAILED` | 500 | F00, F02, F03, F04 | `localStorage.setItem()` throws a `QuotaExceededError`, `SecurityError`, or any exception | Revert optimistic UI update (if applied); show toast notification; no mutation persisted | "Could not save task. Storage may be full." *(F00)* / "Could not update task. Changes were not saved." *(F02)* / "Could not delete task. Please try again." *(F03)* / "Could not save changes. Please try again." *(F04)* |
| `STORAGE_CORRUPT` | — | F01 | Stored JSON is malformed and cannot be parsed | Silent recovery: initialize with empty task list; no user-facing message | *(none — treated as fresh start)* |
| `INVALID_FIELD` | 422 | F02 | A PATCH body field has the wrong type (e.g., `completed` is not a boolean) | Show toast error; no mutation applied | "Invalid request. Please refresh and try again." |

---

### Error Display Conventions

- **Inline error:** Appears directly below or within the relevant input field. Disappears when the user modifies the input or dismisses it. Used only for validation errors on form fields (`TITLE_REQUIRED`, `TITLE_TOO_LONG`).
- **Toast notification:** A brief (3–5 second auto-dismiss) notification overlay, typically in a corner of the screen. Used for transient errors that don't block the user (`TASK_NOT_FOUND`, `STORAGE_WRITE_FAILED`).
- **Banner warning:** A persistent top-of-page message that does not auto-dismiss. Used for session-level failures that affect app functionality (`STORAGE_READ_FAILED`). Requires user acknowledgment or remains until the session ends.
- **Silent recovery:** No user-facing message. The app handles the error internally and continues with a safe default state (`STORAGE_CORRUPT`).

---

### Retry Guidance

| Error Code | User Action | Retry Safe? |
|------------|-------------|-------------|
| `TITLE_REQUIRED` | Correct the input and resubmit | Yes |
| `TITLE_TOO_LONG` | Shorten the title and resubmit | Yes |
| `TASK_NOT_FOUND` | Refresh the page to sync list state | Page reload re-syncs |
| `STORAGE_READ_FAILED` | Check browser settings (disable private mode or allow storage) | After settings change + reload |
| `STORAGE_WRITE_FAILED` | Free up browser storage and retry the action | Yes, after clearing storage |
| `STORAGE_CORRUPT` | No action needed (auto-recovered) | N/A |
| `INVALID_FIELD` | Refresh the page (indicates a client bug) | After page reload |
---

## Y3: Integration Points

**Summary:** TaskTracker v1 has no external service integrations. The application is entirely self-contained in the browser, relying solely on browser-native APIs. This section documents the browser API dependencies and establishes the integration contract for any future external integrations.

---

### v1 Browser API Dependencies

| API | Usage | Fallback / Error Handling |
|-----|-------|--------------------------|
| `window.localStorage` | Primary persistence store — read/write all task data as JSON under key `tasktracker_tasks` | On `SecurityError` (private browsing blocked): surface `STORAGE_READ_FAILED` banner; disable write operations. On `QuotaExceededError`: surface `STORAGE_WRITE_FAILED` toast. |
| `crypto.randomUUID()` | Generate UUID v4 for task `id` at creation time | If unavailable (very old browser): fall back to a polyfill UUID v4 implementation |
| `Date.prototype.toISOString()` | Generate ISO 8601 timestamps for `createdAt` and `updatedAt` | Standard JS — no fallback needed; universally available |
| `JSON.parse()` / `JSON.stringify()` | Serialize and deserialize the tasks array for localStorage storage | On parse failure: catch error, treat as `STORAGE_CORRUPT` (see `Y2-errors.md`), reset to empty array |

---

### Browser Compatibility Contract

TaskTracker v1 must function correctly in the following browsers (current stable versions):

| Browser | Minimum Supported Version | Notes |
|---------|--------------------------|-------|
| Google Chrome | Current stable | Primary development target |
| Mozilla Firefox | Current stable | Full parity expected |
| Apple Safari | Current stable | Test localStorage behavior specifically (Safari has historically had stricter storage policies) |
| Microsoft Edge | Current stable | Chromium-based; Chrome parity expected |

**Not supported:** Internet Explorer (any version). No polyfills for IE are required.

---

### Future Integration Candidates (Post-v1, Out of Scope)

The following integrations are **explicitly out of scope for v1** but are documented here as known future extension points:

| Integration | Trigger | Notes |
|-------------|---------|-------|
| Backend REST API | If multi-device sync is added | The logical API contract in `Y1-api.md` is pre-designed for this migration |
| User Authentication (e.g., Auth0, Firebase Auth) | If multi-user accounts are added | No auth scaffolding in v1; add as a wrapper layer |
| Push Notifications / Reminders | If due-date tracking is added | Not in v1 scope |
| Cloud Storage Sync (e.g., Firebase Realtime DB) | If data backup is added | localStorage → API migration path exists via `Y1-api.md` contract |

---

### Data Migration Contract (localStorage → Future Backend)

If a backend is introduced post-v1, the localStorage data can be migrated as follows:
1. On first load with a backend enabled, read `tasktracker_tasks` from localStorage.
2. `POST /api/tasks` for each task in the local array (preserving `createdAt` and `id` if the backend supports client-supplied IDs).
3. On successful sync confirmation, clear the localStorage key.
4. Future reads/writes go exclusively through the backend API.

This migration path is documented here to ensure the v1 data schema (see `Y0-schema.md`) does not introduce breaking changes to a future backend schema.
