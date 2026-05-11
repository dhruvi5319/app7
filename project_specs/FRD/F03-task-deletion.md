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
