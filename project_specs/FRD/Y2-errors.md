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
