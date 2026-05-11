# UX Mockup: Task Tracker App

**Project:** TaskTracker
**Version:** 1.0
**Generated:** 2026-05-11
**Based on:** UserStories-TaskTracker.md, JOURNEYS-TaskTracker.md, PRD-TaskTracker.md, FRD-TaskTracker.md
**Personas:** Jordan Mills (PER-01, Busy Professional), Alex Rivera (PER-02, Freelancer)

---

## Overview

TaskTracker is a **single-screen application**. There is no navigation, no routing, no modal dialogs. The entire UX lives on one page: a task creation input at the top, a scrollable task list below it. Every action — create, complete, edit, delete — happens inline on this one surface.

### Design Principles

1. **Zero friction on load** — The app must be immediately usable the instant it opens. No loading spinners, no onboarding, no login. The task list and input are visible and ready within 1–2 seconds.
2. **Instant feedback** — Every action (create, toggle, delete, edit) reflects in the UI in under 100ms. No async delays from the user's perspective.
3. **Keyboard-first, mouse-friendly** — Enter to submit, Escape to cancel, Tab to navigate. Mouse users get equally discoverable affordances.
4. **Silent success, explicit failure** — Successful actions confirm themselves visually (task appears, strikethrough applies). Errors surface as inline messages or transient toasts — never silent data loss.
5. **Simplicity reads as intention, not incompleteness** — Minimal chrome, generous whitespace, polished micro-interactions signal that the simplicity is deliberate.

### UX Architecture

```
┌─────────────────────────────────────────────────────┐
│  Single Page: Task List View                        │
│                                                     │
│  ┌─ Storage Banner (conditional) ──────────────┐   │
│  │  "Unable to access local storage…"          │   │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Task Creation Zone (F0) ────────────────────┐  │
│  │  [________________________] [Add Task]        │  │
│  │  (inline validation error zone)               │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Task List (F1) ──────────────────────────────┐ │
│  │  [ ] Task title                  [✎] [🗑]    │ │
│  │  [✓] ~~Completed task~~          [✎] [🗑]    │ │
│  │  …                                             │ │
│  │  ─ or ─                                        │ │
│  │  "No tasks yet. Add one above."               │ │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  ┌─ Toast Notification Zone (transient) ────────┐  │
│  │  (bottom-right corner, auto-dismisses 4s)    │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## User Flows

### Flow 1: Create a Task (Happy Path)

**Trigger:** User opens the app or returns to a pinned tab
**User Stories:** US-0.1, US-0.2, US-0.5
**Journeys:** JRN-01.1 (Jordan mid-meeting), JRN-02.2 (Alex mid-focused work)

```
[App Opens]
     │
     ▼
[Input auto-focused — cursor ready]
     │
     ▼
[User types task title]
     │
     ├── Presses Enter ──────┐
     │                       │
     └── Clicks "Add Task" ──┤
                             ▼
                    [Validate title]
                             │
               ┌─────────────┴──────────────┐
               │                            │
          [Valid title]              [Invalid title]
               │                            │
               ▼                            ▼
     [Task appended to list]    [Inline error shown below input]
     [Input clears]             [Input retains focus]
     [Focus returns to input]   [No task created]
     [localStorage written]
               │
               ▼
     [User sees task in list — confirmed]
```

**Steps:**
1. App loads → Create Input Field is visible at top, auto-focused (no click needed)
2. User types title (any Unicode, up to 500 chars)
3. User submits via Enter or "Add Task" button
4. System trims title, validates (non-empty, ≤ 500 chars)
5. On success: new task row appears at bottom of list; input clears; focus returns to input
6. On validation failure: inline error appears below input; input retains focus and value

---

### Flow 2: View and Scan the Task List

**Trigger:** Page load / app open
**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4, US-0.5
**Journeys:** JRN-01.2 (Jordan morning scan), JRN-02.1 (Alex session resume)

```
[Page Load]
     │
     ▼
[Read localStorage: tasktracker_tasks]
     │
     ├── [Data OK] ─────────────────────────────────────┐
     │                                                   ▼
     │                                   [Render task list (createdAt ASC)]
     │                                           │
     │                              ┌────────────┴────────────┐
     │                              │                         │
     │                         [Tasks exist]           [No tasks]
     │                              │                         │
     │                              ▼                         ▼
     │                     [List renders with          [Empty state:
     │                      title + checkbox            "No tasks yet.
     │                      per row]                    Add one above."]
     │
     ├── [Corrupt JSON] ──────────────────────────────────┐
     │                                                     ▼
     │                                     [Silent reset → empty list]
     │                                     [No user-facing error]
     │
     └── [SecurityError (private browsing)] ──────────────┐
                                                           ▼
                                           [Persistent banner shown]
                                           ["Unable to access local
                                            storage. Tasks will not
                                            be saved."]
                                           [Empty list rendered]
                                           [Write operations disabled]
```

**Steps:**
1. On load, system reads `tasktracker_tasks` from localStorage
2. If read fails with SecurityError → show persistent banner, render empty list, disable writes
3. If JSON corrupt → silent reset to empty list (treated as fresh start)
4. If data OK → sort by `createdAt` ascending, render each task row
5. Incomplete tasks: default text style + unchecked checkbox
6. Completed tasks: strikethrough text + muted/grey color + checked checkbox
7. If list is empty → render empty state message in list area

---

### Flow 3: Complete / Uncomplete a Task

**Trigger:** User clicks a task's checkbox
**User Stories:** US-2.1, US-2.2, US-2.3
**Journeys:** JRN-01.2 (Check stage), JRN-01.3 (Complete stage)

```
[User clicks checkbox on task row]
     │
     ▼
[Optimistic UI update — immediate]
[Toggle visual: checked ↔ unchecked, strikethrough ↔ normal]
     │
     ▼
[Write updated task to localStorage]
     │
     ├── [Success] ──────────────────────────────────────┐
     │                                                    ▼
     │                                   [UI reflects new state]
     │                                   [Task stays in position]
     │
     ├── [TASK_NOT_FOUND] ──────────────────────────────┐
     │                                                    ▼
     │                                   [Revert optimistic update]
     │                                   [Remove stale item from list]
     │                                   [Toast: "Task not found.
     │                                    It may have been deleted."]
     │
     └── [STORAGE_WRITE_FAILED] ────────────────────────┐
                                                         ▼
                                         [Revert optimistic update]
                                         [Toast: "Could not update
                                          task. Changes were not saved."]
```

**Steps:**
1. User clicks the checkbox (or taps on mobile)
2. UI immediately toggles: visual state updates before storage write
3. System flips `completed` boolean, updates `updatedAt` timestamp
4. Write to localStorage
5. On failure: revert visual state, show appropriate toast

---

### Flow 4: Delete a Task

**Trigger:** User clicks the delete (trash) button on a task row
**User Stories:** US-3.1, US-3.2, US-3.3
**Journeys:** JRN-01.3 (Delete stage), JRN-02.3 (Delete Cancelled / Delete Completed Clutter)

```
[User clicks 🗑 delete button on a task row]
     │
     ▼
[NO confirmation dialog]
     │
     ▼
[Optimistic removal — task row disappears immediately]
     │
     ▼
[Remove task from localStorage]
     │
     ├── [Success] ──────────────────────────────────────┐
     │                                                    ▼
     │                                   [List re-flows cleanly]
     │                                   [If last task: empty state shown]
     │
     ├── [TASK_NOT_FOUND (stale)] ──────────────────────┐
     │                                                    ▼
     │                                   [Silent — item already gone]
     │                                   [No error shown]
     │
     └── [STORAGE_WRITE_FAILED] ────────────────────────┐
                                                         ▼
                                         [Revert: re-insert task in list]
                                         [Toast: "Could not delete task.
                                          Please try again."]
```

**Steps:**
1. User clicks trash icon button on any task row (complete or incomplete)
2. No confirmation step — deletion is immediate
3. Task row is removed from the UI instantly
4. localStorage is updated (task filtered from array, full array re-written)
5. If no tasks remain, empty state appears
6. On write failure: task reappears in its original position, error toast shown

---

### Flow 5: Edit a Task Title (Inline)

**Trigger:** User clicks the pencil icon (or edit trigger) on a task row
**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4, US-4.5
**Journeys:** JRN-01.3 (Edit stage), JRN-02.3 (Edit Vague Tasks stage)

```
[User clicks ✎ on a task row]
     │
     ▼
[Task item transitions: View Mode → Edit Mode]
[Static title replaced by inline text input]
[Input pre-populated with current title]
[Cursor placed at end of text]
[Save + Cancel buttons appear]
     │
     │  (If another task was in Edit Mode: silently revert it first)
     │
     ▼
[User modifies text]
     │
     ├── [Presses Enter or clicks Save] ──────────────────┐
     │                                                     │
     │                                         [Validate new title]
     │                                                     │
     │                              ┌──────────────────────┤
     │                              │                      │
     │                         [Valid]               [Invalid]
     │                              │                      │
     │                              ▼                      ▼
     │                   [Write to localStorage]  [Inline error shown]
     │                   [Return to View Mode]    [Stay in Edit Mode]
     │                   [Show new title]         [Input retains focus]
     │
     ├── [Presses Escape or clicks Cancel] ───────────────┐
     │                                                     ▼
     │                                       [Discard changes]
     │                                       [Return to View Mode]
     │                                       [Original title shown]
     │
     └── [Clicks outside input (blur)] ──────────────────┐
                                                          ▼
                                          [Treated as cancel]
                                          [Discard changes]
                                          [Return to View Mode]
```

**Steps:**
1. User clicks the edit trigger (pencil icon or clickable title area) on any task row
2. Only one task can be in Edit Mode at a time — if another is open, it silently reverts
3. Inline input appears, pre-filled with current title, cursor at end
4. Save and Cancel buttons are visible adjacent to input
5. Confirm: Enter key or Save button → validate → write → View Mode with new title
6. Cancel: Escape key, Cancel button, or clicking outside → discard → View Mode with original title
7. Validation errors: shown inline below the edit input; task stays in Edit Mode

---

## Screen Designs

### Screen: Task List View (The Only Screen)

**Purpose:** The complete application interface — task capture, task list, and all task operations
**User Stories:** All (US-0.1 through US-4.5)
**Journeys:** All (JRN-01.1 through JRN-02.3)

---

#### Layout: Default State (Tasks Present)

```
┌──────────────────────────────────────────────────────────────┐
│                    TASK TRACKER                              │
│                  [app title / branding]                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────┐  ┌───────────┐  │
│  │  Add a new task...                     │  │ Add Task  │  │
│  └────────────────────────────────────────┘  └───────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  [ ]  Review Q3 budget proposal              [✎] [🗑] │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  [ ]  Follow up with TechCorp re: proposal   [✎] [🗑] │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  [✓]  ~~Send weekly report~~                 [✎] [🗑] │   │
│  │       (muted/grey text, strikethrough)                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  [ ]  Prepare onboarding document            [✎] [🗑] │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  (list scrolls vertically when overflow)                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                                     [Toast zone — bottom-right]
```

---

#### Layout: Empty State

```
┌──────────────────────────────────────────────────────────────┐
│                    TASK TRACKER                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────┐  ┌───────────┐  │
│  │  Add a new task...                     │  │ Add Task  │  │
│  └────────────────────────────────────────┘  └───────────┘  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│              No tasks yet. Add one above.                    │
│              [muted text, centered in list area]             │
│                                                              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

#### Layout: Storage-Blocked Banner

```
┌──────────────────────────────────────────────────────────────┐
│ ⚠  Unable to access local storage. Tasks will not be saved. │
│    [persistent banner, full width, high-contrast warning]    │
├──────────────────────────────────────────────────────────────┤
│                    TASK TRACKER                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────┐  ┌───────────┐  │
│  │  Add a new task...           [DISABLED]│  │ Add Task  │  │
│  └────────────────────────────────────────┘  └───────────┘  │
│  (input and button visually disabled, non-interactive)       │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│              No tasks yet. Add one above.                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

#### Layout: Task Row — View Mode (Detail)

```
┌──────────────────────────────────────────────────────────────┐
│  [checkbox]  Task title text here                  [✎]  [🗑] │
└──────────────────────────────────────────────────────────────┘

Incomplete task row:
┌──────────────────────────────────────────────────────────────┐
│  ☐  Review Q3 budget proposal                      [✎]  [🗑] │
└──────────────────────────────────────────────────────────────┘

Completed task row:
┌──────────────────────────────────────────────────────────────┐
│  ☑  ~~Send weekly report~~                         [✎]  [🗑] │
│     [grey/muted text + strikethrough]                        │
└──────────────────────────────────────────────────────────────┘
```

**Affordance notes:**
- Checkbox: left-aligned, generous click target (min 44×44px)
- Title: takes up majority of row width; does not trigger edit on click (only ✎ triggers edit, unless title click is wired as edit trigger)
- Edit icon (✎): always visible (not hidden behind hover) — satisfies JRN-01.2 requirement
- Delete icon (🗑): always visible — satisfies CP-02 zero-friction delete requirement
- Row height: min 48px for comfortable touch targets on mobile

---

#### Layout: Task Row — Edit Mode (Detail)

```
┌──────────────────────────────────────────────────────────────┐
│  ☐  [  Follow up with TechCorp re: proposal         ]        │
│     [inline input, pre-filled, cursor at end]                │
│     [Save]  [Cancel]                                         │
│     (optional inline error zone below input)                 │
└──────────────────────────────────────────────────────────────┘

With validation error:
┌──────────────────────────────────────────────────────────────┐
│  ☐  [                                               ]        │
│     [inline input, empty]                                    │
│     [Save]  [Cancel]                                         │
│     ⚠ Task title is required.                                │
└──────────────────────────────────────────────────────────────┘
```

**Affordance notes:**
- Save button: primary style (filled), keyboard equivalent = Enter
- Cancel button: secondary/ghost style, keyboard equivalent = Escape
- Input takes full title-column width of the row
- Checkbox remains visible but non-interactive during Edit Mode
- Delete icon hidden during Edit Mode (to reduce accidental deletion)
- Blur (click outside) = cancel (discard)

---

#### Layout: Create Input — Validation Error State

```
┌──────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────┐  ┌───────────┐  │
│  │                                        │  │ Add Task  │  │
│  └────────────────────────────────────────┘  └───────────┘  │
│  ⚠ Task title is required.                                   │
│  [inline error, red, appears below input, auto-clears on type]│
└──────────────────────────────────────────────────────────────┘
```

---

#### Information Hierarchy

| Priority | Content | Placement | Rationale |
|----------|---------|-----------|-----------|
| **Primary** | Task creation input | Top of page, auto-focused | Entry point for both Jordan (keyboard) and Alex (mouse) — must be zero-friction to reach |
| **Primary** | Task titles (incomplete) | Left-center of each row, full-weight text | The "active work" content users scan for |
| **Secondary** | Checkbox (completion toggle) | Left edge of each row, always visible | Core action — needs constant visibility, not hover-reveal |
| **Secondary** | Edit trigger (✎) | Right side of each row, always visible | Used in cleanup flows — must be discoverable without hovering |
| **Secondary** | Delete trigger (🗑) | Far right of each row, always visible | One-click action — hover-reveal would break CP-02 |
| **Tertiary** | Completed task titles | Left-center, strikethrough + muted | Visible but de-emphasized — users scan past them to find active work |
| **Tertiary** | Empty state message | Center of list area | Contextual; only shown when relevant |
| **Alert** | Inline validation errors | Directly below triggering input | Immediate, localized feedback |
| **Alert** | Toast notifications | Bottom-right corner, auto-dismiss | Non-blocking transient errors |
| **Alert** | Storage banner | Top of page, persistent | Session-level failure, highest severity |

---

#### States

| State | Trigger | Visual Treatment | User Feedback |
|-------|---------|-----------------|---------------|
| **Default — tasks present** | Tasks in localStorage | Task list rendered, input at top | Task rows visible, scannable |
| **Default — empty** | No tasks in storage | "No tasks yet. Add one above." in list area | Instructive empty state, input still active |
| **Input: validation error** | Empty/too-long submit | Red inline error below input; input retains focus | "Task title is required." / "…500 characters or fewer." |
| **Input: cleared + ready** | Successful task creation | Input clears, refocuses | Silent — task appearance is the confirmation |
| **Task: completing** | Checkbox click | Immediate: checkbox checks, strikethrough+mute applies | Instant visual toggle |
| **Task: uncompleting** | Checkbox click on completed | Immediate: checkbox unchecks, normal style restores | Instant visual toggle |
| **Task: in edit mode** | Edit trigger click | Title becomes inline input; Save/Cancel appear | Edit affordance active |
| **Task: edit validation error** | Invalid title on Save | Inline error below edit input; remains in Edit Mode | "Task title is required." / "…500 characters or fewer." |
| **Task: deleted** | Delete button click | Row disappears immediately | Silent — list re-flows |
| **Storage blocked** | localStorage SecurityError | Persistent warning banner, input disabled | "Unable to access local storage. Tasks will not be saved." |
| **Toast: error** | Storage write failure, not-found | Toast in bottom-right, auto-dismisses in 4s | Feature-specific message |
| **Loading** | Page load (< 100ms) | No spinner — direct render from localStorage | Imperceptible; no loading state needed |

---

#### Interactive Elements

| Element | Type | Location | Behavior | Keyboard |
|---------|------|----------|----------|----------|
| Create input | Text input | Top of page | Auto-focused on load; accepts any Unicode title | Type + Enter to submit |
| Add Task button | Primary CTA button | Right of create input | Submits current input value | Enter (when button focused) |
| Task checkbox | Toggle checkbox | Left of each task row | Toggles completed status; immediate visual update | Space to toggle |
| Edit trigger (✎) | Icon button | Right of task title | Activates Edit Mode for that row | Tab to focus + Enter/Space |
| Delete trigger (🗑) | Icon button | Far right of task row | Immediately removes task, no confirmation | Tab to focus + Enter/Space |
| Edit: inline input | Text input | Replaces title in Edit Mode | Pre-filled; accepts edits | Enter to save, Escape to cancel |
| Edit: Save button | Primary button | Adjacent to edit input | Saves title, exits Edit Mode | Enter |
| Edit: Cancel button | Secondary button | Adjacent to edit input | Discards changes, exits Edit Mode | Escape |

---

## Interaction Patterns

### Pattern: Auto-focus Input on Page Load

**User Stories:** US-0.1 (Enter key submission), US-0.2 (button submission)
**Journeys:** JRN-01.1 (Switch stage), JRN-02.2 (Switch stage)

**When to use:** Always — on every page load and tab activation
**Behavior:** The Create Input Field is focused automatically when the page loads. Users can begin typing immediately without clicking. This eliminates the "click then type" step that breaks the sub-15-second capture flow for Jordan and Alex.
**Implementation note:** `autofocus` attribute on the input element, or JS `input.focus()` on `DOMContentLoaded`.

---

### Pattern: Inline Validation Error — Clear on Type

**User Stories:** US-0.3, US-0.4, US-4.4
**Journeys:** All task creation and edit flows

**When to use:** After a failed submit attempt (empty or too-long title)
**Behavior:**
1. Error message appears immediately below the relevant input after a failed submit
2. Error disappears the moment the user begins typing (on `input` event)
3. Input retains focus — user does not need to re-click to correct
4. No task is created/saved on the failed attempt

**Error messages:**
- `TITLE_REQUIRED`: "Task title is required."
- `TITLE_TOO_LONG`: "Task title must be 500 characters or fewer."

---

### Pattern: Optimistic UI Update with Revert

**User Stories:** US-2.1, US-2.2, US-2.3, US-3.1, US-3.3
**Journeys:** JRN-01.3 (Complete, Delete stages)

**When to use:** Completion toggle and task deletion
**Behavior:**
1. UI updates immediately when user triggers the action (checkbox toggle → visual flip; delete → row removal)
2. localStorage write happens synchronously immediately after
3. If write fails: UI reverts to pre-action state (task reappears, toggle reverts)
4. Error toast is shown on revert

**Why optimistic:** localStorage operations are synchronous in browsers — the "optimistic" update and the storage write happen in the same synchronous tick. There is no actual async gap. The optimistic pattern is specified to handle `QuotaExceededError` exceptions where the write completes but throws.

---

### Pattern: Single Edit Mode (One at a Time)

**User Stories:** US-4.1 (only one task editable at a time)
**Journeys:** JRN-02.3 (Edit Vague Tasks — editing two tasks sequentially)

**When to use:** Any time a second edit is triggered while one is already active
**Behavior:**
1. App tracks which task (if any) is in Edit Mode
2. When user clicks edit on a different task: first task silently reverts to View Mode (unsaved changes discarded)
3. Second task enters Edit Mode
4. No warning or confirmation about discarding first edit — this is by design (blur = cancel is the signal)

---

### Pattern: Toast Notification

**User Stories:** US-0.5, US-2.3, US-3.3
**Journeys:** Any storage failure scenario

**When to use:** Transient errors that don't block the user — storage write failures, not-found errors
**Behavior:**
1. Toast appears in bottom-right corner of viewport (fixed position)
2. Contains error message text
3. Auto-dismisses after 4 seconds
4. Multiple toasts stack vertically (newest on top)
5. Does not block interaction with the rest of the app

**Toast messages:**
- `STORAGE_WRITE_FAILED` (create): "Could not save task. Storage may be full."
- `STORAGE_WRITE_FAILED` (toggle): "Could not update task. Changes were not saved."
- `STORAGE_WRITE_FAILED` (delete): "Could not delete task. Please try again."
- `STORAGE_WRITE_FAILED` (edit): "Could not save changes. Please try again."
- `TASK_NOT_FOUND`: "Task not found. It may have been deleted."

---

### Pattern: Persistent Storage Banner

**User Stories:** US-1.4
**Journeys:** JRN-02.1 (Open stage — critical trust moment)

**When to use:** Only when localStorage is completely inaccessible (SecurityError — typically private browsing mode)
**Behavior:**
1. Banner rendered at the very top of the page, above all other content
2. High-contrast background (amber/warning color) — distinguishable from normal UI
3. Contains warning icon + message text
4. Does not auto-dismiss — persists for the entire session
5. Create input and Add Task button are disabled/visually greyed
6. The app is otherwise usable (tasks won't persist but the UI is not broken)

---

### Pattern: Zero-Confirmation Delete

**User Stories:** US-3.1, US-3.2
**Journeys:** JRN-01.3 (Delete stage), JRN-02.3 (Delete Cancelled, Delete Completed Clutter)
**Cross-Journey Pattern:** CP-02

**When to use:** Every delete action in v1
**Behavior:** Single click on delete button removes the task immediately. No "Are you sure?" dialog. No undo in v1.
**Rationale:** Both personas (Jordan and Alex) clean up tasks in rapid-fire sessions. A confirmation dialog doubles the click count for every delete, causing users to stop mid-cleanup. The personas are solo users — no risk of deleting shared team work.

---

### Pattern: Completed Task Visual Differentiation

**User Stories:** US-1.2, US-2.1, US-2.2
**Journeys:** JRN-01.2 (Scan stage), JRN-02.1 (Scan stage)
**Cross-Journey Pattern:** CP-04

**When to use:** Any task with `completed: true`
**Behavior:** Two simultaneous signals applied:
1. **Strikethrough:** line through the title text
2. **Muted color:** text color shifts to grey/secondary (reduced opacity or explicit color token)

Both signals together ensure the distinction is "immediately apparent without needing to read the checkbox state" (US-1.2 acceptance criteria). One signal alone (e.g., only strikethrough) is insufficient for fast visual scanning.

---

## Responsive Considerations

### Desktop (> 1024px)

- Single-column centered layout, max-width ~680px, horizontally centered
- Create input zone: input field takes ~80% width, "Add Task" button to the right
- Task rows: comfortable 56px height with visible padding
- Edit/Delete icons always visible (not hover-dependent — persona requirement)
- Inline edit input spans full title column width
- Toast notifications: fixed bottom-right, 320px wide

### Tablet (768px – 1024px)

- Same single-column layout, max-width expands to ~90% of viewport
- Create input + button stack behavior: input shrinks, button remains full-text "Add Task"
- Task row height: 52px minimum
- Edit/Delete icons remain visible; touch targets remain ≥ 44px
- Toast notifications: fixed bottom-right, 280px wide

### Mobile (< 768px)

- Full-width layout, 16px side padding
- Create zone: input field full width on one line; "Add Task" button full width below it — OR — input takes ~75% width with compact "+" button
- Task rows: 56px minimum height, generous padding (16px vertical) for fat-finger touch
- Checkbox click target: expanded to 44×44px minimum (not just the checkbox square)
- Edit and Delete icons: always visible; do not collapse to a "..." overflow menu — single-action discoverability is critical per CP-02
- Edit Mode: inline input uses full row width; Save/Cancel buttons below the input (stacked, full-width) on very small screens
- Toast: fixed bottom-center on mobile (easier to read than bottom-right corner)
- Storage banner: full width, 2-line text allowed, padding 12px

---

## Accessibility Notes

### Color Contrast

- Completed task muted text: must maintain minimum 3:1 contrast ratio against the background (WCAG AA for large text; 4.5:1 for normal text) — use a grey that passes rather than the palest possible
- Error message text (red): must meet 4.5:1 contrast ratio against white/light background
- Storage banner: sufficient contrast between warning background and text (amber background with dark text is typically safe)
- Primary CTA button ("Add Task", "Save"): high contrast, clearly distinguishable

### Keyboard Navigation

All interactions must be fully operable via keyboard alone (PRD §6 Accessibility requirement):

| Action | Keyboard |
|--------|----------|
| Focus create input | Tab (from page load, auto-focused) |
| Submit new task | Enter (while create input focused) |
| Focus Add Task button | Tab from create input |
| Navigate task rows | Tab (cycles through checkbox → edit → delete for each row) |
| Toggle completion | Space (while checkbox focused) |
| Activate Edit Mode | Enter or Space (while ✎ button focused) |
| Confirm edit | Enter (while edit input focused) |
| Cancel edit | Escape (while edit input focused) |
| Delete task | Enter or Space (while 🗑 button focused) |
| Dismiss toast | Escape (if toast is focused) or auto-dismiss |

Tab order follows DOM order: Create input → Add Task button → [for each task: Checkbox → Edit button → Delete button] → repeat.

### Screen Reader Considerations

- **Task list:** Use `<ul>` / `<li>` or ARIA `role="list"` / `role="listitem"` for the task list
- **Checkboxes:** Native `<input type="checkbox">` with associated `<label>` containing the task title — or custom element with `role="checkbox"`, `aria-checked`, and accessible name
- **Dynamic updates:** When a task is added, removed, or completed, use `aria-live="polite"` on the list container so screen readers announce changes without interrupting the user
- **Error messages:** Inline validation errors should be associated with their input via `aria-describedby`; use `role="alert"` or `aria-live="assertive"` so they are announced immediately
- **Toast notifications:** Use `role="alert"` or `role="status"` with `aria-live="polite"` — screen readers will announce them without stealing focus
- **Storage banner:** Use `role="alert"` for the persistent banner; it should be announced immediately on render
- **Icon buttons:** Edit (✎) and Delete (🗑) icon buttons must have accessible names: `aria-label="Edit task: [task title]"` and `aria-label="Delete task: [task title]"` — this avoids "button button button" announcements
- **Empty state:** Should be inside the list container so screen readers encounter it when navigating the list

### ARIA Labels and Roles Reference

```
<main role="main">
  <!-- Storage banner (if shown) -->
  <div role="alert" aria-live="assertive">Unable to access local storage...</div>

  <!-- Create zone -->
  <form aria-label="Create new task">
    <input type="text"
           aria-label="New task title"
           aria-describedby="create-error"
           placeholder="Add a new task..." />
    <span id="create-error" role="alert" aria-live="assertive">
      [validation error if any]
    </span>
    <button type="submit">Add Task</button>
  </form>

  <!-- Task list -->
  <ul role="list" aria-label="Tasks" aria-live="polite">
    <li role="listitem">
      <input type="checkbox"
             id="task-{id}"
             aria-label="Mark complete: [task title]"
             checked|unchecked />
      <label for="task-{id}">[task title]</label>
      <button aria-label="Edit task: [task title]">✎</button>
      <button aria-label="Delete task: [task title]">🗑</button>
    </li>
  </ul>

  <!-- Toast zone -->
  <div role="status" aria-live="polite" aria-atomic="true">
    [toast message if any]
  </div>
</main>
```

---

## Story Coverage Checklist

| Story ID | Description | Covered in |
|----------|-------------|------------|
| US-0.1 | Create via keyboard (Enter) | Flow 1, Pattern: Auto-focus, Screen: Interactive Elements |
| US-0.2 | Create via button | Flow 1, Screen: Interactive Elements |
| US-0.3 | Reject empty submit | Flow 1, Pattern: Inline Validation, Screen: States |
| US-0.4 | Reject too-long title | Flow 1, Pattern: Inline Validation, Screen: States |
| US-0.5 | Persist across refresh | Flow 2, Screen: States (Default) |
| US-1.1 | View all tasks on load | Flow 2, Screen: Layout (Default) |
| US-1.2 | Visual completion distinction | Screen: Task Row (View Mode), Pattern: Completed Visual Diff |
| US-1.3 | Empty state | Flow 2, Screen: Layout (Empty) |
| US-1.4 | Recover from corrupt storage | Flow 2, Screen: Layout (Banner), Pattern: Persistent Banner |
| US-2.1 | Mark complete | Flow 3, Screen: States |
| US-2.2 | Unmark complete | Flow 3, Screen: States |
| US-2.3 | Handle stale toggle | Flow 3, Pattern: Toast Notification |
| US-3.1 | Delete a task | Flow 4, Pattern: Zero-Confirmation Delete |
| US-3.2 | Delete completed task | Flow 4, Pattern: Zero-Confirmation Delete |
| US-3.3 | Handle deletion failure | Flow 4, Pattern: Toast Notification |
| US-4.1 | Enter Edit Mode | Flow 5, Screen: Task Row (Edit Mode) |
| US-4.2 | Save edited title | Flow 5, Screen: Task Row (Edit Mode), Pattern: Single Edit Mode |
| US-4.3 | Cancel edit | Flow 5, Screen: Task Row (Edit Mode), Pattern: Single Edit Mode |
| US-4.4 | Reject invalid edit on save | Flow 5, Pattern: Inline Validation |
| US-4.5 | Edit completed task title | Flow 5, Screen: Task Row (Edit Mode) |

**Coverage: 20 / 20 stories ✓**

---

*UX-Mockup generated: 2026-05-11 | Project: TaskTracker | Version: 1.0*
*Source: UserStories-TaskTracker.md, JOURNEYS-TaskTracker.md, PRD-TaskTracker.md, FRD-TaskTracker.md, PROJECT.md*
