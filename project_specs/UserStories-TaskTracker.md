# User Stories: Task Tracker App

| Field | Value |
|---|---|
| **Product Name** | Task Tracker App |
| **Project Acronym** | TaskTracker |
| **Version** | 1.0 |
| **Date** | 2026-05-11 |
| **Related PRD** | PRD-TaskTracker.md v1.0 |
| **Related FRD** | FRD-TaskTracker.md v1.0 |
| **Status** | Draft |

---

## Personas

| ID | Name | Role |
|---|---|---|
| PER-01 | Jordan Mills | Busy Professional |
| PER-02 | Alex Rivera | Freelancer / Independent Worker |

---

## Epic 0: Task Creation (F0)

**Description:** Users can capture a new task by typing a title and submitting. The interaction is single-field, instant, and requires no modals or multi-step forms. This is the primary entry point to the application.

---

### US-0.1: Create a Task via Keyboard
**As a** Jordan Mills, **I want to** type a task title and press Enter to save it, **so that** I can capture tasks instantly without reaching for the mouse during a meeting or phone call.

**Acceptance Criteria:**
- [ ] A text input field is visible at the top of the task list on page load without any additional clicks
- [ ] Pressing Enter while the input is focused creates the task and appends it to the bottom of the list
- [ ] The input field clears automatically after successful submission
- [ ] Keyboard focus returns to the input field after submission, ready for the next entry
- [ ] The new task appears in the list without a page reload

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Create a Task via Button
**As a** Alex Rivera, **I want to** click an "Add Task" button to save a new task, **so that** I have a clear, discoverable action to submit tasks when I prefer using the mouse.

**Acceptance Criteria:**
- [ ] An "Add Task" button (or equivalent) is rendered adjacent to the input field
- [ ] Clicking the button with a valid title creates the task and appends it to the list
- [ ] The input clears and focus returns to it after button-based submission
- [ ] Button submission behaves identically to keyboard (Enter) submission

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Reject Empty Task Submission
**As a** Jordan Mills, **I want to** be told when I try to submit an empty task title, **so that** I don't accidentally create blank tasks that pollute my list.

**Acceptance Criteria:**
- [ ] Submitting an empty or whitespace-only title does not create a task
- [ ] An inline error message "Task title is required." appears below the input field
- [ ] The input retains focus so the user can correct the title immediately
- [ ] The error message disappears when the user begins typing
- [ ] No task is written to the data store on a failed submission

**Test Setup:** Submit the form with the input field empty (no characters). Separately, submit with a title containing only spaces or tab characters to verify whitespace-only trimming.

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Reject Overly Long Task Title
**As a** Alex Rivera, **I want to** be notified when my task title is too long, **so that** I know to shorten it before the app rejects it.

**Acceptance Criteria:**
- [ ] Submitting a title exceeding 500 characters (after trimming) is rejected
- [ ] An inline error message "Task title must be 500 characters or fewer." appears below the input
- [ ] The input retains focus and the entered text is preserved so the user can edit it
- [ ] No task is created or persisted when the title exceeds the character limit

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.5: Persist New Tasks Across Page Refresh
**As a** Jordan Mills, **I want to** see tasks I created earlier when I reload the page, **so that** tasks I captured during the day aren't lost when I switch browser tabs or restart.

**Acceptance Criteria:**
- [ ] Newly created tasks are written to localStorage immediately upon creation
- [ ] After a full page reload, all previously created tasks appear in the list in the same order
- [ ] If the data store write fails, a toast error "Could not save task. Storage may be full." is shown and the task is not added to the list

**Priority:** P0 | **Feature Ref:** F0

---

## Epic 1: Task List View (F1)

**Description:** The task list is the application's sole screen. It displays all tasks in a scrollable list with title and completion status, persists across page refreshes, and shows an empty state when no tasks exist.

---

### US-1.1: View All Tasks on Load
**As a** Alex Rivera, **I want to** see all my tasks immediately when I open the app, **so that** I can pick up exactly where I left off without re-entering anything.

**Acceptance Criteria:**
- [ ] On page load, the app reads tasks from localStorage and renders them in the list
- [ ] Tasks are displayed in insertion order — oldest task (lowest `createdAt`) at the top, newest at the bottom — and this order is stable across page reloads
- [ ] Each list item shows the task title and a completion status indicator (checkbox)
- [ ] The list is scrollable when it contains more tasks than fit in the viewport
- [ ] The task list renders without requiring any user interaction or login

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Distinguish Completed Tasks Visually
**As a** Jordan Mills, **I want to** see completed tasks styled differently from incomplete ones, **so that** I can quickly scan my list and focus on what still needs to be done.

**Acceptance Criteria:**
- [ ] Completed tasks (completed: true) are rendered with strikethrough text and muted/greyed color
- [ ] Incomplete tasks (completed: false) are rendered in the default active visual style
- [ ] The visual distinction is immediately apparent without needing to read the checkbox state
- [ ] Visual styling updates immediately when a task's completion status is toggled (no reload)

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: See Empty State When No Tasks Exist
**As a** Jordan Mills, **I want to** see a helpful message when my task list is empty, **so that** I understand the app is working and know where to start adding tasks.

**Acceptance Criteria:**
- [ ] When no tasks are stored, the list area displays the message "No tasks yet. Add one above."
- [ ] The empty state message is shown on first load (fresh install) and after all tasks are deleted
- [ ] The create input field remains visible and functional above the empty state
- [ ] The empty state disappears as soon as the first task is created

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Recover Gracefully from Corrupt Storage
**As a** Alex Rivera, **I want to** be able to use the app even if my stored task data is somehow corrupted, **so that** a storage error doesn't permanently break the app for me.

**Acceptance Criteria:**
- [ ] If localStorage data is malformed JSON, the app initializes with an empty task list silently (no error shown)
- [ ] If localStorage is inaccessible (e.g., private browsing blocked), a persistent banner warning "Unable to access local storage. Tasks will not be saved." is shown
- [ ] When the banner is shown, the app renders an empty list and disables write operations gracefully
- [ ] The app never crashes or shows an unhandled error due to storage issues

**Priority:** P0 | **Feature Ref:** F1

---

## Epic 2: Task Completion (F2)

**Description:** Users can toggle any task between incomplete and complete states. The toggle is reversible, updates instantly, and is persisted to the data store.

---

### US-2.1: Mark a Task as Complete
**As a** Jordan Mills, **I want to** check off a task when I finish it, **so that** I get the satisfaction of closing out work and can see what I've accomplished at the end of the day.

**Acceptance Criteria:**
- [ ] Each task item displays a checkbox (or equivalent) reflecting its current completed state
- [ ] Clicking the checkbox on an incomplete task immediately marks it complete (checked) and applies strikethrough + muted styling to the title
- [ ] The completed status and an updated updatedAt timestamp are written to localStorage
- [ ] The UI updates without a page reload
- [ ] The task remains in its original position in the list (no reordering on completion)

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.2: Unmark a Completed Task
**As a** Alex Rivera, **I want to** uncheck a task I marked complete by mistake, **so that** I can correct my list without deleting and re-creating the task.

**Acceptance Criteria:**
- [ ] Clicking the checkbox on a completed task immediately marks it incomplete and removes the strikethrough + muted styling
- [ ] Both false→true and true→false toggles are always permitted with no restrictions
- [ ] The uncompleted status and an updated updatedAt timestamp are persisted to localStorage
- [ ] The UI reflects the uncompleted state instantly without a page reload

**Priority:** P0 | **Feature Ref:** F2

---

### US-2.3: Handle Stale Task Toggle Gracefully
**As a** Jordan Mills, **I want to** see a clear message if a task I'm trying to complete no longer exists, **so that** the app doesn't silently fail or leave me with a broken UI.

**Acceptance Criteria:**
- [ ] If a toggle is attempted on a task ID that no longer exists in the data store, any optimistic UI update is reverted
- [ ] A toast notification "Task not found. It may have been deleted." is shown
- [ ] The stale list item is removed from the rendered list
- [ ] If the data store write fails, a toast "Could not update task. Changes were not saved." is shown and the toggle is reverted

**Test Setup (stale ID):** With a task rendered in the list, manually remove it from `localStorage` (via browser DevTools → Application → Local Storage → edit `tasktracker_tasks` to delete the entry) while the list remains on screen. Then click the completion toggle on the now-stale rendered item. **Test Setup (write failure):** Override `localStorage.setItem` to throw a `QuotaExceededError` (via browser console: `Storage.prototype.setItem = () => { throw new DOMException('QuotaExceededError'); }`) and attempt a toggle.

**Priority:** P0 | **Feature Ref:** F2

---

## Epic 3: Task Deletion (F3)

**Description:** Users can permanently remove any task from their list in a single action. Deletion is immediate with no confirmation dialog and no undo in v1.

---

### US-3.1: Delete a Task
**As a** Jordan Mills, **I want to** delete a task I no longer need with a single click, **so that** I can keep my list clean without navigating through confirmation dialogs.

**Acceptance Criteria:**
- [ ] Each task list item renders a delete control (e.g., trash icon button or "Delete" button)
- [ ] Clicking the delete control immediately removes the task from the rendered list
- [ ] No confirmation dialog or prompt is shown before deletion
- [ ] The task record is removed from localStorage after deletion
- [ ] If the deleted task was the last one, the empty state message is displayed

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Delete a Completed Task
**As a** Alex Rivera, **I want to** delete tasks regardless of whether they are complete or incomplete, **so that** I can clean up finished client work or cancelled items without needing to uncheck them first.

**Acceptance Criteria:**
- [ ] The delete control is available on all task items regardless of their completed status
- [ ] Deleting a completed task removes it from the list and the data store with no additional steps
- [ ] Deleting an incomplete task behaves identically to deleting a completed task

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Handle Deletion Failure Gracefully
**As a** Jordan Mills, **I want to** see a clear error if my task couldn't be deleted, **so that** I know to try again and don't think the task is gone when it actually wasn't removed.

**Acceptance Criteria:**
- [ ] If the localStorage write fails during deletion, any optimistic removal is reverted and the task reappears in the list
- [ ] A toast notification "Could not delete task. Please try again." is displayed
- [ ] If the task ID is already absent from the data store (stale), the item is silently removed from the list with no error message (idempotent behavior)

**Test Setup (write failure):** Override `localStorage.setItem` to throw a `QuotaExceededError` (via browser console: `Storage.prototype.setItem = () => { throw new DOMException('QuotaExceededError'); }`) and attempt to delete a task. **Test Setup (stale ID):** With a task rendered in the list, manually remove it from `localStorage` via DevTools while the page stays open, then click the delete control on the stale item — expect silent removal with no toast.

**Priority:** P0 | **Feature Ref:** F3

---

## Epic 4: Task Editing (F4)

**Description:** Users can edit the title of any existing task inline within the list item. Editing is activated by clicking a trigger on the task, confirmed with Enter or a Save button, and cancelled with Escape or a Cancel button. Only one task may be in edit mode at a time.

---

### US-4.1: Enter Edit Mode for a Task
**As a** Alex Rivera, **I want to** click on a task to edit its title inline, **so that** I can refine a task description as the scope becomes clearer without leaving the page.

**Acceptance Criteria:**
- [ ] Each task item renders an edit trigger (e.g., pencil icon or clickable title)
- [ ] Clicking the edit trigger transitions the task item to Edit Mode, replacing the static title with an inline text input
- [ ] The inline input is pre-populated with the current task title and the cursor is placed at the end
- [ ] Save and Cancel buttons are shown adjacent to the input while in Edit Mode
- [ ] Only one task may be in Edit Mode at a time — activating edit on a second task silently discards unsaved changes on the first

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.2: Save an Edited Task Title
**As a** Jordan Mills, **I want to** confirm a title edit by pressing Enter or clicking Save, **so that** my corrected task name is persisted without needing to navigate away.

**Acceptance Criteria:**
- [ ] Pressing Enter while the inline input is focused saves the edited title (trimmed) and returns the item to View Mode
- [ ] Clicking the Save button saves the edited title and returns the item to View Mode
- [ ] The updated title and a refreshed updatedAt timestamp are written to localStorage
- [ ] The task list item immediately displays the new title in View Mode after saving
- [ ] If the new title is identical to the original, the save completes gracefully (no-op write) and the item returns to View Mode

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.3: Cancel a Task Edit
**As a** Alex Rivera, **I want to** press Escape or click Cancel to discard my edit, **so that** I can exit Edit Mode without accidentally overwriting a task title I didn't mean to change.

**Acceptance Criteria:**
- [ ] Pressing Escape while the inline input is focused discards changes and returns the item to View Mode with the original title
- [ ] Clicking the Cancel button discards changes and returns the item to View Mode with the original title
- [ ] Clicking outside the inline input (blur event) without confirming is treated as a cancel — changes are discarded
- [ ] No changes are made to the task object or data store on cancel

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.4: Reject Invalid Title on Save
**As a** Jordan Mills, **I want to** be warned if I try to save a blank or overly long task title, **so that** I can correct it before leaving Edit Mode.

**Acceptance Criteria:**
- [ ] Attempting to save an empty or whitespace-only title shows an inline error "Task title is required." and keeps the item in Edit Mode
- [ ] Attempting to save a title exceeding 500 characters shows an inline error "Task title must be 500 characters or fewer." and keeps the item in Edit Mode
- [ ] The input retains focus on validation failure
- [ ] No changes are written to the data store on a validation failure

**Priority:** P1 | **Feature Ref:** F4

---

### US-4.5: Edit a Completed Task's Title
**As a** Alex Rivera, **I want to** edit the title of a task regardless of whether it is marked complete, **so that** I can refine descriptions on finished items without needing to uncheck them first.

**Acceptance Criteria:**
- [ ] The edit trigger is available on all task items regardless of completed status
- [ ] Editing and saving a completed task's title updates the title without changing its completed status
- [ ] The task remains visually styled as completed (strikethrough, muted) after a successful title edit

**Priority:** P1 | **Feature Ref:** F4

---

## Story Index

| Story ID | Title | Persona | Priority | Feature Ref |
|---|---|---|---|---|
| US-0.1 | Create a Task via Keyboard | Jordan Mills | P0 | F0 |
| US-0.2 | Create a Task via Button | Alex Rivera | P0 | F0 |
| US-0.3 | Reject Empty Task Submission | Jordan Mills | P0 | F0 |
| US-0.4 | Reject Overly Long Task Title | Alex Rivera | P0 | F0 |
| US-0.5 | Persist New Tasks Across Page Refresh | Jordan Mills | P0 | F0 |
| US-1.1 | View All Tasks on Load | Alex Rivera | P0 | F1 |
| US-1.2 | Distinguish Completed Tasks Visually | Jordan Mills | P0 | F1 |
| US-1.3 | See Empty State When No Tasks Exist | Jordan Mills | P0 | F1 |
| US-1.4 | Recover Gracefully from Corrupt Storage | Alex Rivera | P0 | F1 |
| US-2.1 | Mark a Task as Complete | Jordan Mills | P0 | F2 |
| US-2.2 | Unmark a Completed Task | Alex Rivera | P0 | F2 |
| US-2.3 | Handle Stale Task Toggle Gracefully | Jordan Mills | P0 | F2 |
| US-3.1 | Delete a Task | Jordan Mills | P0 | F3 |
| US-3.2 | Delete a Completed Task | Alex Rivera | P0 | F3 |
| US-3.3 | Handle Deletion Failure Gracefully | Jordan Mills | P0 | F3 |
| US-4.1 | Enter Edit Mode for a Task | Alex Rivera | P1 | F4 |
| US-4.2 | Save an Edited Task Title | Jordan Mills | P1 | F4 |
| US-4.3 | Cancel a Task Edit | Alex Rivera | P1 | F4 |
| US-4.4 | Reject Invalid Title on Save | Jordan Mills | P1 | F4 |
| US-4.5 | Edit a Completed Task's Title | Alex Rivera | P1 | F4 |

**Total stories: 20** | P0: 15 | P1: 5

---

## Priority Definitions

| Priority | Label | Meaning |
|---|---|---|
| **P0** | Critical | Required for MVP ship. These stories represent the minimum viable product — the application cannot be released without them. |
| **P1** | High | Included in v1 active scope. These stories are committed for this release but are not MVP blockers — they deliver high user value and are required before the product is considered complete. |
| **P2** | Medium | Post-v1 candidate. Valuable but deferred to the next release cycle pending v1 validation. |
| **P3** | Low | Backlog. Low priority; not scheduled. |

---

*UserStories generated: 2026-05-11 | Project: TaskTracker | Version: 1.0 | Source: PRD-TaskTracker.md v1.0, FRD-TaskTracker.md v1.0, PERSONAS-TaskTracker.md v1.0*
