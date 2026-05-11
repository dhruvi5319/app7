# Requirements Traceability Matrix: Task Tracker App

| Field | Value |
|---|---|
| **Product Name** | Task Tracker App |
| **Project Acronym** | TaskTracker |
| **Document Type** | Requirements Traceability Matrix (RTM) |
| **Version** | 1.0 |
| **Date** | 2026-05-11 |
| **Status** | Draft |
| **Source Documents** | PRD-TaskTracker.md v1.0, FRD-TaskTracker.md v1.0, TechArch-TaskTracker.md v1.0, UserStories-TaskTracker.md v1.0 |

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all Task Tracker specification documents. It ensures every business requirement defined in the Product Requirements Document (PRD) is decomposed into a functional specification in the Functional Requirements Document (FRD), realized through architectural decisions in the Technical Architecture document (TechArch), and validated through User Stories with defined acceptance criteria.

TaskTracker v1 is a lightweight, single-user, browser-based task management application. The RTM covers five product features — Task Creation (F0), Task List View (F1), Task Completion (F2), Task Deletion (F3), and Task Editing (F4) — plus cross-cutting concerns including the data storage schema (Y0), the client-side API contract (Y1), the error catalog (Y2), and integration points (Y3). Four P0 (Critical / MVP) features and one P1 (High) feature are traced end-to-end.

The traceability hierarchy flows in one direction — PRD Feature → FRD Feature → TechArch Component/API → User Story — and is reversible in the other direction, allowing any user story or architectural decision to be traced back to its originating business requirement. This matrix serves as the authoritative linkage record for v1 and must be updated whenever any linked specification document changes.

---

## 2. Requirements Summary

### PRD Features

- **F0 — Task Creation (P0):** Single-field task title input with keyboard and button submission; empty/overlong title rejection; immediate list append; localStorage persistence.
- **F1 — Task List View (P0):** Display all persisted tasks on page load in insertion order; visual differentiation of completed vs. incomplete tasks; empty state; graceful storage error recovery.
- **F2 — Task Completion (P0):** Reversible toggle of completed status per task; immediate UI update; persistence of completed flag and updatedAt timestamp.
- **F3 — Task Deletion (P0):** Single-action permanent deletion with no confirmation dialog; immediate list update; localStorage removal; empty state on last deletion.
- **F4 — Task Editing (P1):** Inline title editing with Enter/Save confirmation and Escape/Cancel discard; one-at-a-time edit mode; validation of empty and overlong titles; persistence of updated title and updatedAt timestamp.

### Non-Functional Requirements

- **Performance:** All task operations (create, complete, delete, edit) must respond within 100ms for local operations.
- **Persistence:** Tasks must survive page refresh; data loss on reload is not acceptable; localStorage key `tasktracker_tasks` is the persistence mechanism.
- **Accessibility:** Full keyboard navigation; all interactive elements reachable without a mouse.
- **Compatibility:** Works in current stable Chrome, Firefox, Safari, and Edge.
- **Simplicity:** No onboarding flow, no account creation, no setup steps; app is immediately usable on load.
- **Security:** Origin-scoped localStorage; React JSX escaping prevents XSS; input trimming and length cap before storage; `QuotaExceededError` and `SecurityError` caught and surfaced gracefully.

### FRD Feature Sections

- **F00 — Task Creation FRD:** POST /api/tasks; validation rules (TITLE_REQUIRED, TITLE_TOO_LONG); task object generation with UUID v4 id, timestamps, completed: false.
- **F01 — Task List View FRD:** GET /api/tasks; createdAt ASC sort order; empty state; STORAGE_READ_FAILED and STORAGE_CORRUPT error handling.
- **F02 — Task Completion FRD:** PATCH /api/tasks/:id (completed field); optimistic UI toggle; TASK_NOT_FOUND and STORAGE_WRITE_FAILED handling.
- **F03 — Task Deletion FRD:** DELETE /api/tasks/:id; idempotent stale-ID handling; STORAGE_WRITE_FAILED revert behavior.
- **F04 — Task Editing FRD:** PATCH /api/tasks/:id (title field); Edit Mode / View Mode state machine; single-task-at-a-time constraint; blur-as-cancel behavior.
- **Y0 — Storage Schema:** `tasktracker_tasks` localStorage key; Task interface with id, title, completed, createdAt, updatedAt; data integrity rules.
- **Y1 — API Contract:** GET, POST, PATCH, DELETE endpoint specifications; partial update rules; REST-shaped for future backend migration.
- **Y2 — Error Catalog:** TITLE_REQUIRED, TITLE_TOO_LONG, TASK_NOT_FOUND, STORAGE_READ_FAILED, STORAGE_WRITE_FAILED, STORAGE_CORRUPT, INVALID_FIELD — each with HTTP status, UI behavior, and user-facing message.
- **Y3 — Integration Points:** Browser API dependencies (localStorage, crypto.randomUUID, Date.toISOString, JSON); browser compatibility contract; post-v1 migration path.

### TechArch Specifications

- **SPA Architecture:** Client-only React SPA with localStorage persistence; no backend, no network requests; REST-shaped client API module for future swappability.
- **Component Architecture:** App.tsx (state owner), TaskList, TaskItem, CreateTaskInput, EmptyState, Toast, Banner, InlineError components; src/api/tasks.ts client API layer; src/storage/localStorage.ts adapter.
- **Data Model:** Single Task entity (id UUID v4, title VARCHAR(500), completed BOOLEAN, createdAt/updatedAt ISO 8601); stored as JSON array under `tasktracker_tasks`.
- **API Design:** getTasks(), createTask(), updateTask(), deleteTask() module functions; REST endpoint contract (GET/POST/PATCH/DELETE /api/tasks); TypeScript interfaces for Task, CreateTaskRequest, UpdateTaskRequest, error codes.
- **Security Architecture:** No auth in v1; origin-scoped localStorage; React JSX XSS protection; input sanitization; QuotaExceededError and SecurityError handling; recommended CSP header.
- **Technology Stack:** React 18, TypeScript 5, Vite 5, CSS Modules, Vitest 1, React Testing Library 14, ESLint, Prettier.

### User Stories

- **Epic 0 (F0):** 5 stories — US-0.1 through US-0.5 — covering keyboard creation, button creation, empty rejection, overlong rejection, and persistence.
- **Epic 1 (F1):** 4 stories — US-1.1 through US-1.4 — covering list load, visual differentiation, empty state, and corrupt storage recovery.
- **Epic 2 (F2):** 3 stories — US-2.1 through US-2.3 — covering mark complete, unmark complete, and stale toggle handling.
- **Epic 3 (F3):** 3 stories — US-3.1 through US-3.3 — covering delete, delete completed, and deletion failure handling.
- **Epic 4 (F4):** 5 stories — US-4.1 through US-4.5 — covering enter edit mode, save edit, cancel edit, invalid title on save, and editing completed task.
- **Total: 20 stories — 15 P0, 5 P1.**

---

## 3. Traceability Matrix

### 3.1 PRD Feature → FRD → TechArch → User Stories

| PRD Feature | Priority | FRD Section | TechArch Component / API | User Stories |
|---|---|---|---|---|
| **F0: Task Creation** | P0 | F00 | `CreateTaskInput`, `src/api/tasks.ts` → `createTask()`, POST /api/tasks, `TITLE_REQUIRED` / `TITLE_TOO_LONG` / `STORAGE_WRITE_FAILED` (Y2) | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5 |
| **F1: Task List View** | P0 | F01 | `TaskList`, `EmptyState`, `App.tsx` (state + load), `getTasks()`, GET /api/tasks, `STORAGE_READ_FAILED` / `STORAGE_CORRUPT` (Y2), `Banner` | US-1.1, US-1.2, US-1.3, US-1.4 |
| **F2: Task Completion** | P0 | F02 | `TaskItem` (checkbox), `updateTask()`, PATCH /api/tasks/:id (`completed`), `TASK_NOT_FOUND` / `STORAGE_WRITE_FAILED` (Y2), `Toast` | US-2.1, US-2.2, US-2.3 |
| **F3: Task Deletion** | P0 | F03 | `TaskItem` (delete button), `deleteTask()`, DELETE /api/tasks/:id, `TASK_NOT_FOUND` / `STORAGE_WRITE_FAILED` (Y2), `Toast` | US-3.1, US-3.2, US-3.3 |
| **F4: Task Editing** | P1 | F04 | `TaskItem` (Edit Mode / View Mode, inline input), `updateTask()`, PATCH /api/tasks/:id (`title`), `TITLE_REQUIRED` / `TITLE_TOO_LONG` / `TASK_NOT_FOUND` / `STORAGE_WRITE_FAILED` (Y2), `InlineError`, `Toast` | US-4.1, US-4.2, US-4.3, US-4.4, US-4.5 |

### 3.2 Cross-Cutting / Infrastructure Traceability

| PRD NFR / Constraint | FRD Section | TechArch Specification | User Story Coverage |
|---|---|---|---|
| Persistence across page refresh | Y0 (Storage Schema), Y3 (Integration Points) | `src/storage/localStorage.ts`; `tasktracker_tasks` key; atomic read→modify→write | US-0.5, US-1.1, US-1.4 |
| Task data model (id, title, completed, timestamps) | Y0 (Task Object Schema) | `src/types/task.ts` Task interface; localStorage JSON array | US-0.1 through US-4.5 (all stories) |
| REST-shaped API contract | Y1 (API Endpoints) | `src/api/tasks.ts` module functions; GET/POST/PATCH/DELETE endpoint specs | All stories (via API calls) |
| Error handling catalog | Y2 (Error Catalog) | `Toast`, `Banner`, `InlineError` UI components; typed error codes in `src/types/task.ts` | US-0.3, US-0.4, US-0.5, US-1.4, US-2.3, US-3.3, US-4.4 |
| Browser API dependencies | Y3 (Integration Points) | `window.localStorage`, `crypto.randomUUID()`, `Date.toISOString()`, `JSON.parse/stringify` | US-0.5, US-1.4 |
| No authentication in v1 | PRD §3 Out of Scope | TechArch §5 Security Architecture (no auth; origin-scoped localStorage) | N/A (out of scope) |
| Keyboard accessibility | PRD §6 NFR | `CreateTaskInput` (Enter key submit), `TaskItem` (keyboard edit/save/cancel), `InlineError` focus retention | US-0.1, US-4.2, US-4.3 |
| Performance (< 100ms) | PRD §6 NFR | Client-only SPA; synchronous localStorage; optimistic UI updates | All P0 stories |

### 3.3 FRD Error Code → TechArch → User Story

| Error Code | HTTP Status | FRD Section | TechArch Handler | User Story |
|---|---|---|---|---|
| `TITLE_REQUIRED` | 422 | F00, F04 / Y2 | `InlineError` below `CreateTaskInput` / `TaskItem` inline input | US-0.3, US-4.4 |
| `TITLE_TOO_LONG` | 422 | F00, F04 / Y2 | `InlineError` below `CreateTaskInput` / `TaskItem` inline input | US-0.4, US-4.4 |
| `TASK_NOT_FOUND` | 404 | F02, F03, F04 / Y2 | `Toast` notification; stale item removed from list | US-2.3, US-3.3, US-4.4 (implicit) |
| `STORAGE_READ_FAILED` | 500 | F01 / Y2 | Persistent `Banner` warning; app renders empty list; writes disabled | US-1.4 |
| `STORAGE_WRITE_FAILED` | 500 | F00, F02, F03, F04 / Y2 | `Toast` notification; optimistic UI update reverted | US-0.5, US-2.3, US-3.3 |
| `STORAGE_CORRUPT` | — | F01 / Y2 | Silent recovery; app resets to `[]`; no user message | US-1.4 |
| `INVALID_FIELD` | 422 | F02 / Y2 | `Toast` notification; no mutation applied | US-2.3 (implicit) |

---

## 4. Requirements Detail

### F0: Task Creation

**PRD Description:** Users can create a new task by providing a title via a single input field. Submission via Enter key or Add Task button. Empty submissions rejected. Task appears immediately in list.

**FRD Functional Requirements (F00):**
- Create Input Field always visible at top of task list on page load without additional clicks
- Submit action: Enter key while input is focused, or Add Task button click
- Title validation: non-empty after trim, maximum 500 characters; rejects otherwise with inline error
- On success: generates Task object (`id` UUID v4, `title` trimmed, `completed: false`, `createdAt` / `updatedAt` ISO 8601)
- Task written to localStorage; task list re-renders with new item appended at bottom
- Input field clears and focus returns after successful submission
- Error codes: `TITLE_REQUIRED` (inline error), `TITLE_TOO_LONG` (inline error), `STORAGE_WRITE_FAILED` (toast)

**TechArch Implementation:**
- `CreateTaskInput` component owns `inputValue` and `error` local state; calls `onCreate` callback on valid submit; renders `InlineError` on validation failure
- `createTask()` function in `src/api/tasks.ts` performs validation, ID/timestamp generation, localStorage write via `src/storage/localStorage.ts`
- API: POST /api/tasks — request `{ title: string }`, response 201 with Task object

**User Stories:**
- US-0.1: Create a Task via Keyboard (Jordan Mills) — P0
- US-0.2: Create a Task via Button (Alex Rivera) — P0
- US-0.3: Reject Empty Task Submission (Jordan Mills) — P0
- US-0.4: Reject Overly Long Task Title (Alex Rivera) — P0
- US-0.5: Persist New Tasks Across Page Refresh (Jordan Mills) — P0

---

### F1: Task List View

**PRD Description:** Single unified list displaying all tasks with title and completion status. Visual distinction between completed and incomplete tasks. Persists across page refresh.

**FRD Functional Requirements (F01):**
- On page load: read all tasks from `tasktracker_tasks` localStorage key; deserialize JSON; sort by `createdAt` ASC
- Render each task with title and checkbox (completion indicator)
- Completed tasks (completed: true) rendered with strikethrough + muted color; incomplete tasks in default style
- List is scrollable; updates reactively on any task mutation (F00, F02, F03, F04)
- Empty state: "No tasks yet. Add one above." when task array is empty
- Error codes: `STORAGE_READ_FAILED` (persistent Banner, disable writes), `STORAGE_CORRUPT` (silent reset to [])

**TechArch Implementation:**
- `App.tsx` owns `tasks: Task[]` state; calls `getTasks()` on mount; renders `Banner` on `STORAGE_READ_FAILED`
- `TaskList` maps tasks to `TaskItem` elements; renders `EmptyState` when array is empty; preserves `createdAt` sort order
- `getTasks()` in `src/api/tasks.ts` reads and deserializes localStorage; sorts by `createdAt` ASC
- API: GET /api/tasks — response 200 with Task[] (empty array when no tasks, not 404)

**User Stories:**
- US-1.1: View All Tasks on Load (Alex Rivera) — P0
- US-1.2: Distinguish Completed Tasks Visually (Jordan Mills) — P0
- US-1.3: See Empty State When No Tasks Exist (Jordan Mills) — P0
- US-1.4: Recover Gracefully from Corrupt Storage (Alex Rivera) — P0

---

### F2: Task Completion

**PRD Description:** Users can toggle any task between incomplete and complete. Toggle is reversible. Visual indicator updates immediately.

**FRD Functional Requirements (F02):**
- Each task renders a completion indicator (checkbox); checked state reflects `completed` field
- Click/tap toggles `completed` (false→true or true→false); both directions always permitted
- Optimistic UI update: visual state changes immediately on click
- Task object updated: `completed` flipped, `updatedAt` refreshed; written to localStorage
- No task reordering on toggle; tasks remain in insertion order
- Error codes: `TASK_NOT_FOUND` (revert optimistic update, remove stale item, toast), `STORAGE_WRITE_FAILED` (revert, toast)

**TechArch Implementation:**
- `TaskItem` manages `isEditing` state; renders checkbox; calls `onToggle` callback
- `updateTask(id, { completed: !current })` in `src/api/tasks.ts`; refreshes `updatedAt`; persists
- API: PATCH /api/tasks/:id — request `{ completed: boolean }`, response 200 with updated Task
- `Toast` component for error notifications

**User Stories:**
- US-2.1: Mark a Task as Complete (Jordan Mills) — P0
- US-2.2: Unmark a Completed Task (Alex Rivera) — P0
- US-2.3: Handle Stale Task Toggle Gracefully (Jordan Mills) — P0

---

### F3: Task Deletion

**PRD Description:** Users can permanently remove a task. Single-click deletion with no confirmation dialog. Task removed immediately.

**FRD Functional Requirements (F03):**
- Each task renders a delete control (trash icon button or "Delete" button)
- No confirmation dialog in v1; deletion proceeds immediately
- Optimistic removal: task removed from rendered list immediately
- Task record removed from localStorage: read array → filter out by id → write back
- If last task deleted, Empty State is displayed
- Error codes: `TASK_NOT_FOUND` (silent removal — treat as already deleted), `STORAGE_WRITE_FAILED` (revert optimistic removal, re-add task to list, toast)

**TechArch Implementation:**
- `TaskItem` renders delete button; calls `onDelete` callback
- `deleteTask(id)` in `src/api/tasks.ts`; idempotent (no error if already absent); persists remaining array
- API: DELETE /api/tasks/:id — response 204 No Content; 404 treated as silent success in v1
- `Toast` component for `STORAGE_WRITE_FAILED`

**User Stories:**
- US-3.1: Delete a Task (Jordan Mills) — P0
- US-3.2: Delete a Completed Task (Alex Rivera) — P0
- US-3.3: Handle Deletion Failure Gracefully (Jordan Mills) — P0

---

### F4: Task Editing

**PRD Description:** Users can edit the title of an existing task inline. Save with Enter/button, cancel with Escape/button. Empty title rejected on save.

**FRD Functional Requirements (F04):**
- Each task renders an edit trigger (pencil icon or clickable title)
- Activating edit: task item transitions to Edit Mode; inline input pre-populated with current title, cursor at end; Save and Cancel buttons shown
- Only one task in Edit Mode at a time; activating second edit silently discards first's unsaved changes
- Confirm (Enter or Save): validate title (non-empty after trim, ≤500 chars); update `title` and `updatedAt`; persist; return to View Mode
- Cancel (Escape, Cancel button, or blur): discard changes; return to View Mode with original title; no data store write
- Error codes: `TITLE_REQUIRED` (inline error, remain in Edit Mode), `TITLE_TOO_LONG` (inline error, remain in Edit Mode), `TASK_NOT_FOUND` (exit Edit Mode, remove stale item, toast), `STORAGE_WRITE_FAILED` (remain in Edit Mode, toast)

**TechArch Implementation:**
- `TaskItem` manages local `isEditing` boolean state; renders View Mode (title + edit trigger) or Edit Mode (inline input + Save/Cancel)
- `updateTask(id, { title: trimmedValue })` in `src/api/tasks.ts`; refreshes `updatedAt`; persists
- API: PATCH /api/tasks/:id — request `{ title: string }`, response 200 with updated Task
- `InlineError` for validation errors; `Toast` for storage/not-found errors

**User Stories:**
- US-4.1: Enter Edit Mode for a Task (Alex Rivera) — P1
- US-4.2: Save an Edited Task Title (Jordan Mills) — P1
- US-4.3: Cancel a Task Edit (Alex Rivera) — P1
- US-4.4: Reject Invalid Title on Save (Jordan Mills) — P1
- US-4.5: Edit a Completed Task's Title (Alex Rivera) — P1

---

## 5. Test Case Coverage Matrix

The following test cases are derived directly from the acceptance criteria defined in each User Story. Each `TEST-` ID corresponds to one or more acceptance criteria checkpoints. Vitest (unit) and React Testing Library (behavioral UI) are the designated test frameworks per TechArch §6.

| Test ID | User Story | Test Description | Type | Priority | Expected Outcome |
|---|---|---|---|---|---|
| TEST-001 | US-0.1 | Input field visible on page load without any clicks | UI | P0 | Input rendered at top of list on mount |
| TEST-002 | US-0.1 | Enter key creates task and appends to list | UI | P0 | Task appears at bottom; no page reload |
| TEST-003 | US-0.1 | Input clears and focus returns after Enter submission | UI | P0 | Input value = ""; focus on input element |
| TEST-004 | US-0.2 | Add Task button creates task with valid title | UI | P0 | Task appended; input cleared; focus returned |
| TEST-005 | US-0.2 | Button and Enter submissions behave identically | UI | P0 | Same task object created by both paths |
| TEST-006 | US-0.3 | Empty title submission does not create task | Unit + UI | P0 | No task created; `TITLE_REQUIRED` inline error shown |
| TEST-007 | US-0.3 | Whitespace-only title submission rejected | Unit | P0 | Trimmed title = ""; TITLE_REQUIRED error |
| TEST-008 | US-0.3 | Inline error disappears when user begins typing | UI | P0 | Error element removed on input change |
| TEST-009 | US-0.4 | Title > 500 characters rejected on submit | Unit + UI | P0 | No task created; TITLE_TOO_LONG inline error shown |
| TEST-010 | US-0.5 | Newly created task written to localStorage immediately | Unit | P0 | `tasktracker_tasks` key contains new task after createTask() |
| TEST-011 | US-0.5 | Tasks persist across full page reload | UI | P0 | Tasks re-render from localStorage on mount |
| TEST-012 | US-0.5 | Storage write failure shows toast and does not add task | Unit + UI | P0 | STORAGE_WRITE_FAILED toast shown; task list unchanged |
| TEST-013 | US-1.1 | All tasks rendered on page load in insertion order | UI | P0 | Tasks ordered by createdAt ASC; oldest at top |
| TEST-014 | US-1.1 | Each task shows title and checkbox | UI | P0 | Title text and checkbox present per task item |
| TEST-015 | US-1.1 | List is scrollable with many tasks | UI | P0 | Scroll behavior active when task count exceeds viewport |
| TEST-016 | US-1.2 | Completed tasks rendered with strikethrough and muted color | UI | P0 | CSS classes applied for completed: true tasks |
| TEST-017 | US-1.2 | Visual style updates immediately on toggle | UI | P0 | Style change occurs without page reload |
| TEST-018 | US-1.3 | Empty state message shown when no tasks exist | UI | P0 | "No tasks yet. Add one above." rendered |
| TEST-019 | US-1.3 | Empty state disappears when first task created | UI | P0 | EmptyState component unmounted after task creation |
| TEST-020 | US-1.4 | Malformed JSON in localStorage resets to empty list | Unit | P0 | App initializes with [] on STORAGE_CORRUPT; no crash |
| TEST-021 | US-1.4 | Inaccessible localStorage shows persistent Banner warning | UI | P0 | Banner with "Unable to access local storage..." shown |
| TEST-022 | US-1.4 | App never crashes on storage errors | Unit | P0 | No unhandled exceptions thrown |
| TEST-023 | US-2.1 | Clicking checkbox on incomplete task marks it complete | UI | P0 | completed: true; strikethrough style applied |
| TEST-024 | US-2.1 | Completion status and updatedAt persisted to localStorage | Unit | P0 | Updated task object in localStorage after toggle |
| TEST-025 | US-2.1 | Task remains in original position after completion | UI | P0 | Task list order unchanged after toggle |
| TEST-026 | US-2.2 | Clicking checkbox on completed task marks it incomplete | UI | P0 | completed: false; strikethrough removed |
| TEST-027 | US-2.2 | Both toggle directions always permitted | Unit | P0 | No restrictions on true→false or false→true |
| TEST-028 | US-2.3 | Toggle on stale task ID reverts UI and shows toast | Unit + UI | P0 | TASK_NOT_FOUND toast; stale item removed from list |
| TEST-029 | US-2.3 | Storage write failure on toggle reverts UI | Unit + UI | P0 | STORAGE_WRITE_FAILED toast; completed state reverted |
| TEST-030 | US-3.1 | Delete control present on each task item | UI | P0 | Delete button/icon rendered per task |
| TEST-031 | US-3.1 | Clicking delete removes task from list immediately | UI | P0 | Task removed without page reload; no confirmation dialog |
| TEST-032 | US-3.1 | Deleted task removed from localStorage | Unit | P0 | Task absent from tasktracker_tasks after deleteTask() |
| TEST-033 | US-3.1 | Deleting last task shows empty state | UI | P0 | EmptyState rendered after final task deletion |
| TEST-034 | US-3.2 | Delete control available on completed tasks | UI | P0 | Delete button present regardless of completed status |
| TEST-035 | US-3.2 | Deleting completed task behaves identically to incomplete | Unit | P0 | Same deletion logic regardless of completed flag |
| TEST-036 | US-3.3 | Storage write failure on delete reverts removal and shows toast | Unit + UI | P0 | STORAGE_WRITE_FAILED toast; task reappears in list |
| TEST-037 | US-3.3 | Stale task delete silently removes item with no toast | Unit + UI | P0 | Item removed; no error message shown |
| TEST-038 | US-4.1 | Edit trigger present on each task item | UI | P1 | Pencil icon or clickable title rendered per task |
| TEST-039 | US-4.1 | Clicking edit trigger switches task to Edit Mode | UI | P1 | Inline input replaces static title; Save/Cancel shown |
| TEST-040 | US-4.1 | Inline input pre-populated with current title, cursor at end | UI | P1 | Input value = task.title; cursor position = end |
| TEST-041 | US-4.1 | Activating second edit discards first unsaved changes | UI | P1 | First task returns to View Mode; second enters Edit Mode |
| TEST-042 | US-4.2 | Enter key saves edited title and returns to View Mode | UI | P1 | New title displayed; Edit Mode deactivated |
| TEST-043 | US-4.2 | Save button saves edited title and returns to View Mode | UI | P1 | Same behavior as Enter key |
| TEST-044 | US-4.2 | Updated title and updatedAt written to localStorage | Unit | P1 | Task object in localStorage reflects new title and timestamp |
| TEST-045 | US-4.2 | Saving identical title completes gracefully (no-op write) | Unit | P1 | View Mode returned; no unnecessary localStorage write |
| TEST-046 | US-4.3 | Escape key discards edit and returns to View Mode | UI | P1 | Original title displayed; no data store change |
| TEST-047 | US-4.3 | Cancel button discards edit and returns to View Mode | UI | P1 | Original title displayed; no data store change |
| TEST-048 | US-4.3 | Blur (clicking outside input) treated as cancel | UI | P1 | Original title displayed on blur; no data store change |
| TEST-049 | US-4.4 | Empty title on Save shows inline error; stays in Edit Mode | UI | P1 | TITLE_REQUIRED inline error; Edit Mode maintained |
| TEST-050 | US-4.4 | Title > 500 chars on Save shows inline error; stays in Edit Mode | UI | P1 | TITLE_TOO_LONG inline error; Edit Mode maintained |
| TEST-051 | US-4.5 | Edit trigger available on completed tasks | UI | P1 | Edit button/trigger present regardless of completed status |
| TEST-052 | US-4.5 | Editing completed task does not change completed status | Unit | P1 | completed field unchanged after title update |
| TEST-053 | US-4.5 | Completed task styling preserved after title edit | UI | P1 | Strikethrough and muted color remain after save |

**Total test cases: 53** | P0: 37 | P1: 16

---

## 6. Coverage Summary

| PRD Feature | FRD Section | User Stories | Test Cases | Story Coverage | Test Coverage |
|---|---|---|---|---|---|
| F0: Task Creation | F00 | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5 (5) | TEST-001 – TEST-012 (12) | 100% | 100% |
| F1: Task List View | F01 | US-1.1, US-1.2, US-1.3, US-1.4 (4) | TEST-013 – TEST-022 (10) | 100% | 100% |
| F2: Task Completion | F02 | US-2.1, US-2.2, US-2.3 (3) | TEST-023 – TEST-029 (7) | 100% | 100% |
| F3: Task Deletion | F03 | US-3.1, US-3.2, US-3.3 (3) | TEST-030 – TEST-037 (8) | 100% | 100% |
| F4: Task Editing | F04 | US-4.1, US-4.2, US-4.3, US-4.4, US-4.5 (5) | TEST-038 – TEST-053 (16) | 100% | 100% |
| **Total** | **F00–F04, Y0–Y3** | **20 stories** | **53 test cases** | **100%** | **100%** |

### Error Code Coverage

| Error Code | FRD Section | User Stories | Test Cases |
|---|---|---|---|
| `TITLE_REQUIRED` | F00, F04 / Y2 | US-0.3, US-4.4 | TEST-006, TEST-007, TEST-049 |
| `TITLE_TOO_LONG` | F00, F04 / Y2 | US-0.4, US-4.4 | TEST-009, TEST-050 |
| `TASK_NOT_FOUND` | F02, F03, F04 / Y2 | US-2.3, US-3.3 | TEST-028, TEST-037 |
| `STORAGE_READ_FAILED` | F01 / Y2 | US-1.4 | TEST-021 |
| `STORAGE_WRITE_FAILED` | F00, F02, F03, F04 / Y2 | US-0.5, US-2.3, US-3.3 | TEST-012, TEST-029, TEST-036 |
| `STORAGE_CORRUPT` | F01 / Y2 | US-1.4 | TEST-020 |
| `INVALID_FIELD` | F02 / Y2 | US-2.3 (implicit) | TEST-028 (covers stale toggle path) |

---

## 7. Bidirectional Traceability

### Forward Traceability (PRD → User Story)

| PRD Feature | → FRD | → TechArch | → User Story |
|---|---|---|---|
| F0: Task Creation | F00 | `CreateTaskInput`, `createTask()`, POST /api/tasks | US-0.1 → US-0.5 |
| F1: Task List View | F01 | `TaskList`, `EmptyState`, `getTasks()`, GET /api/tasks | US-1.1 → US-1.4 |
| F2: Task Completion | F02 | `TaskItem` checkbox, `updateTask()`, PATCH /api/tasks/:id | US-2.1 → US-2.3 |
| F3: Task Deletion | F03 | `TaskItem` delete, `deleteTask()`, DELETE /api/tasks/:id | US-3.1 → US-3.3 |
| F4: Task Editing | F04 | `TaskItem` Edit Mode, `updateTask()`, PATCH /api/tasks/:id | US-4.1 → US-4.5 |

### Reverse Traceability (User Story → PRD)

| User Story | → TechArch | → FRD | → PRD Feature |
|---|---|---|---|
| US-0.1: Keyboard Task Creation | `CreateTaskInput` (Enter key), `createTask()` | F00 submit action, validation | F0: Task Creation |
| US-0.2: Button Task Creation | `CreateTaskInput` (Add Task button), `createTask()` | F00 submit action | F0: Task Creation |
| US-0.3: Reject Empty Submission | `InlineError`, `TITLE_REQUIRED` handling in `createTask()` | F00 validation rules, Y2 error catalog | F0: Task Creation |
| US-0.4: Reject Overlong Title | `InlineError`, `TITLE_TOO_LONG` handling in `createTask()` | F00 validation rules, Y2 error catalog | F0: Task Creation |
| US-0.5: Persist Across Refresh | `src/storage/localStorage.ts`, `tasktracker_tasks` key | F00 persistence, Y0 schema, Y3 integration | F0: Task Creation |
| US-1.1: View All Tasks on Load | `App.tsx` mount + `getTasks()`, `TaskList` sort | F01 process (step 1–4), Y1 GET /api/tasks | F1: Task List View |
| US-1.2: Visual Differentiation | `TaskItem` CSS (strikethrough/muted), `TaskList` | F01 visual differentiation, F02 style update | F1: Task List View |
| US-1.3: Empty State | `EmptyState` component, `TaskList` conditional render | F01 empty state, Y2 non-error empty state | F1: Task List View |
| US-1.4: Corrupt Storage Recovery | `src/storage/localStorage.ts` error handling, `Banner` | F01 error states (STORAGE_READ_FAILED, STORAGE_CORRUPT) | F1: Task List View |
| US-2.1: Mark Complete | `TaskItem` checkbox, `updateTask({ completed: true })` | F02 process (step 2–6), Y1 PATCH | F2: Task Completion |
| US-2.2: Unmark Complete | `TaskItem` checkbox, `updateTask({ completed: false })` | F02 toggle (both directions), Y1 PATCH | F2: Task Completion |
| US-2.3: Stale Toggle Handling | `Toast`, optimistic revert in `App.tsx`, `TaskItem` | F02 error states (TASK_NOT_FOUND, STORAGE_WRITE_FAILED) | F2: Task Completion |
| US-3.1: Delete a Task | `TaskItem` delete button, `deleteTask()` | F03 process (step 2–6), Y1 DELETE | F3: Task Deletion |
| US-3.2: Delete Completed Task | `TaskItem` delete button (any status), `deleteTask()` | F03 validation (any completed status) | F3: Task Deletion |
| US-3.3: Deletion Failure | `Toast`, optimistic revert, `deleteTask()` error handling | F03 error states (TASK_NOT_FOUND, STORAGE_WRITE_FAILED) | F3: Task Deletion |
| US-4.1: Enter Edit Mode | `TaskItem` Edit Mode state, `isEditing` boolean | F04 process (step 2–3), Edit Mode definition | F4: Task Editing |
| US-4.2: Save Edited Title | `TaskItem` Save/Enter, `updateTask({ title })` | F04 confirm action, Y1 PATCH | F4: Task Editing |
| US-4.3: Cancel Edit | `TaskItem` Cancel/Escape/blur, no `updateTask()` call | F04 cancel action, blur-as-cancel rule | F4: Task Editing |
| US-4.4: Reject Invalid Title on Save | `InlineError`, `TITLE_REQUIRED`/`TITLE_TOO_LONG` handling | F04 validation rules, Y2 error catalog | F4: Task Editing |
| US-4.5: Edit Completed Task | `TaskItem` edit trigger (any status), `updateTask({ title })` | F04 validation (any completed status) | F4: Task Editing |

---

## 8. Change Management

| Change ID | Date | Description | Affected Documents | Affected Requirements | Author | Status |
|---|---|---|---|---|---|---|
| CHG-001 | 2026-05-11 | Initial RTM created from PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | All | All | RTM Generator | Approved |

---

## 9. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Product Owner | — | ___________________________ | __________ |
| Engineering Lead | — | ___________________________ | __________ |
| QA Lead | — | ___________________________ | __________ |
| Technical Architect | — | ___________________________ | __________ |

---

## Appendix A: Document Revision History

| Version | Date | Description | Author |
|---|---|---|---|
| 1.0 | 2026-05-11 | Initial draft — full traceability across PRD, FRD, TechArch, UserStories | RTM Generator |

---

## Appendix B: Referenced Documents

| Document | Version | Location | Status |
|---|---|---|---|
| PROJECT.md | — | `.planning/PROJECT.md` | Active |
| PRD-TaskTracker.md | 1.0 | `project_specs/PRD-TaskTracker.md` | Draft |
| FRD-TaskTracker.md | 1.0 | `project_specs/FRD-TaskTracker.md` | Draft |
| TechArch-TaskTracker.md | 1.0 | `project_specs/TechArch-TaskTracker.md` | Draft |
| UserStories-TaskTracker.md | 1.0 | `project_specs/UserStories-TaskTracker.md` | Draft |

---

## Appendix C: ID Convention Reference

| Prefix | Level | Format | Example |
|---|---|---|---|
| F | PRD Feature | `F{n}` | F0, F1, F2, F3, F4 |
| F0n | FRD Feature Section | `F{nn}` (zero-padded) | F00, F01, F02, F03, F04 |
| Y | FRD Cross-Cutting Section | `Y{n}` | Y0 (Schema), Y1 (API), Y2 (Errors), Y3 (Integration) |
| US | User Story | `US-{epic}.{n}` | US-0.1, US-1.3, US-4.5 |
| TEST | Test Case | `TEST-{nnn}` | TEST-001, TEST-012, TEST-053 |
| CHG | Change Record | `CHG-{nnn}` | CHG-001 |
| PER | Persona | `PER-{nn}` | PER-01 (Jordan Mills), PER-02 (Alex Rivera) |
| ERR | Error Code | `SCREAMING_SNAKE_CASE` | TITLE_REQUIRED, TASK_NOT_FOUND |

---

*RTM generated: 2026-05-11 | Project: TaskTracker | Version: 1.0 | Source: PRD-TaskTracker.md v1.0, FRD-TaskTracker.md v1.0, TechArch-TaskTracker.md v1.0, UserStories-TaskTracker.md v1.0*
