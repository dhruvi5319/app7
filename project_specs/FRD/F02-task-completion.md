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
