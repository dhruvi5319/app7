# STORY-MAP: Task Tracker App

| Field | Value |
|---|---|
| **Product Name** | Task Tracker App |
| **Project Acronym** | TaskTracker |
| **Version** | 1.0 |
| **Date** | 2026-05-11 |
| **Author** | Pivota Spec Story Map Generator |
| **Status** | Draft |
| **Related Artifacts** | PRD-TaskTracker.md · PERSONAS-TaskTracker.md · JTBD-TaskTracker.md · JOURNEYS-TaskTracker.md · UserStories-TaskTracker.md |

---

## Overview

This Story Map organizes all 20 user stories (US-0.1 – US-4.5) onto a two-dimensional grid:

- **X-axis (columns):** Journey stages derived from JOURNEYS-TaskTracker.md — the temporal flow a persona experiences within a single session
- **Y-axis (rows):** Activities within each stage, mapped to PRD epics (F0–F4) and specific user stories

Each story is annotated with a **Natural Acceptance Criteria (NaC)** statement — a testable criterion derived from the intersection of a JTBD outcome and the journey stage context. NaC are not invented; they are traced from a specific JTBD outcome through its journey-stage application to a measurable condition.

**Story Map Entry IDs** use the convention `SM-{Epic}.{NN}` (e.g., SM-0.1 = Epic 0, first mapped entry).

**Releases:**
- **R1 — Core Workflow (MVP):** All P0 stories. Delivers a complete, end-to-end task management journey for both personas.
- **R2 — Full Fidelity:** All P1 stories. Adds inline editing, completing the list hygiene and task refinement journeys.

---

## Story Map Matrix

The journey stages below represent consolidated cross-journey stages used in both JRN-01.x and JRN-02.x. Each column header maps to one or more named stages from JOURNEYS-TaskTracker.md.

| Journey Stage | JRN Stage Refs | Epic | SM-ID | User Story | Primary Persona | NaC (derived from JTBD) | Release |
|---|---|---|---|---|---|---|---|
| **ARRIVE** — Open app; list loads | JRN-01.2:Open, JRN-01.3:Open, JRN-02.1:Open | Epic 1 (F1) | SM-1.1 | US-1.1: View All Tasks on Load | PER-02 Alex | JTBD-02.1: All previously saved tasks are visible within 10 seconds of page open — no login, no spinner, no empty onboarding state | R1 |
| **ARRIVE** | JRN-01.2:Open, JRN-02.1:Open | Epic 1 (F1) | SM-1.3 | US-1.3: See Empty State When No Tasks Exist | PER-01 Jordan | JTBD-01.1: On first load with no tasks, a clear prompt is shown so Jordan can immediately begin capturing without confusion | R1 |
| **ARRIVE** | JRN-02.1:Open, JRN-01.2:Open | Epic 1 (F1) | SM-1.4 | US-1.4: Recover Gracefully from Corrupt Storage | PER-02 Alex | JTBD-02.1: If storage is corrupt or inaccessible, the app remains usable with a visible warning — Alex's session is never blocked by a broken error state | R1 |
| **SCAN** — Read full list; assess status | JRN-01.2:Scan, JRN-01.2:Assess, JRN-02.1:Scan, JRN-02.1:Orient, JRN-02.3:Review | Epic 1 (F1) | SM-1.2 | US-1.2: Distinguish Completed Tasks Visually | PER-01 Jordan | JTBD-01.2: Completed tasks are visually distinct (strikethrough + muted) from active ones so Jordan identifies her top 3 priorities within 60 seconds | R1 |
| **CAPTURE** — Enter new task | JRN-01.1:Switch, JRN-01.1:Type, JRN-02.2:Switch, JRN-02.2:Type | Epic 0 (F0) | SM-0.1 | US-0.1: Create a Task via Keyboard | PER-01 Jordan | JTBD-01.1: Jordan types a task title and presses Enter; the task appears in the list immediately — elapsed time from page-open to task visible is under 15 seconds | R1 |
| **CAPTURE** | JRN-02.2:Switch, JRN-02.2:Type | Epic 0 (F0) | SM-0.2 | US-0.2: Create a Task via Button | PER-02 Alex | JTBD-02.2: Alex can submit a task via button click with the same instant result as keyboard — no additional navigation or mouse-unfriendly flow | R1 |
| **CAPTURE** | JRN-01.1:Type, JRN-02.2:Type | Epic 0 (F0) | SM-0.3 | US-0.3: Reject Empty Task Submission | PER-01 Jordan | JTBD-01.1: Submitting an empty field surfaces an inline error without navigating away — Jordan stays in the capture flow with zero wasted time | R1 |
| **CAPTURE** | JRN-01.1:Type, JRN-02.2:Type | Epic 0 (F0) | SM-0.4 | US-0.4: Reject Overly Long Task Title | PER-02 Alex | JTBD-02.2: Submitting an over-length title surfaces an inline error with the text preserved — Alex corrects without retyping | R1 |
| **SUBMIT & CONFIRM** — Task saved; list updates | JRN-01.1:Submit, JRN-01.1:Return, JRN-02.2:Submit, JRN-02.2:Return | Epic 0 (F0) | SM-0.5 | US-0.5: Persist New Tasks Across Page Refresh | PER-01 Jordan | JTBD-01.1: A task created mid-meeting survives a page reload — Jordan is never surprised by a missing task after switching tabs | R1 |
| **COMPLETE** — Toggle task done/undone | JRN-01.2:Check, JRN-01.3:Complete, JRN-02.1:Scan | Epic 2 (F2) | SM-2.1 | US-2.1: Mark a Task as Complete | PER-01 Jordan | JTBD-01.3: Clicking the checkbox immediately applies strikethrough + muted styling and persists the state — Jordan closes out a task in under 5 seconds with no reload | R1 |
| **COMPLETE** | JRN-01.3:Complete, JRN-02.1:Scan | Epic 2 (F2) | SM-2.2 | US-2.2: Unmark a Completed Task | PER-02 Alex | JTBD-01.3: A completed task can be unchecked instantly — Alex corrects a mistaken completion without deleting and recreating the task | R1 |
| **COMPLETE** | JRN-01.3:Complete | Epic 2 (F2) | SM-2.3 | US-2.3: Handle Stale Task Toggle Gracefully | PER-01 Jordan | JTBD-01.3: If a toggle fails, optimistic UI is reverted and a toast explains what happened — Jordan never sees a broken UI state after a failed interaction | R1 |
| **DELETE** — Remove task from list | JRN-01.3:Delete, JRN-02.3:Delete Cancelled, JRN-02.3:Delete Completed Clutter | Epic 3 (F3) | SM-3.1 | US-3.1: Delete a Task | PER-01 Jordan | JTBD-01.3: Clicking delete removes a task instantly with no confirmation dialog — Jordan cleans up stale tasks in a single click during end-of-day closure | R1 |
| **DELETE** | JRN-02.3:Delete Cancelled, JRN-02.3:Delete Completed Clutter | Epic 3 (F3) | SM-3.2 | US-3.2: Delete a Completed Task | PER-02 Alex | JTBD-02.3: A completed task can be deleted without unchecking it first — Alex prunes the list in one action per task regardless of completion state | R1 |
| **DELETE** | JRN-01.3:Delete | Epic 3 (F3) | SM-3.3 | US-3.3: Handle Deletion Failure Gracefully | PER-01 Jordan | JTBD-01.3: If a deletion fails, the task reappears and a toast is shown — Jordan never believes a task is gone when it actually wasn't removed | R1 |
| **EDIT** — Correct or refine task title | JRN-01.3:Edit, JRN-02.3:Edit Vague Tasks | Epic 4 (F4) | SM-4.1 | US-4.1: Enter Edit Mode for a Task | PER-02 Alex | JTBD-02.3: Clicking a task's edit trigger transitions it to inline edit mode — Alex refines a task title without leaving the list view or opening a modal | R2 |
| **EDIT** | JRN-01.3:Edit, JRN-02.3:Edit Vague Tasks | Epic 4 (F4) | SM-4.2 | US-4.2: Save an Edited Task Title | PER-01 Jordan | JTBD-01.3: Pressing Enter in the inline edit field saves the corrected title immediately — Jordan fixes a fast-captured title in under 5 seconds without navigating away | R2 |
| **EDIT** | JRN-01.3:Edit, JRN-02.3:Edit Vague Tasks | Epic 4 (F4) | SM-4.3 | US-4.3: Cancel a Task Edit | PER-02 Alex | JTBD-02.3: Pressing Escape or clicking Cancel discards the edit and restores the original title — Alex can exit edit mode safely if she changed her mind | R2 |
| **EDIT** | JRN-01.3:Edit, JRN-02.3:Edit Vague Tasks | Epic 4 (F4) | SM-4.4 | US-4.4: Reject Invalid Title on Save | PER-01 Jordan | JTBD-02.3: Attempting to save a blank or over-long title surfaces an inline error and keeps the item in Edit Mode — no invalid state is persisted | R2 |
| **EDIT** | JRN-02.3:Edit Vague Tasks | Epic 4 (F4) | SM-4.5 | US-4.5: Edit a Completed Task's Title | PER-02 Alex | JTBD-02.3: A completed task's title can be edited inline without changing its completion state — Alex refines a finished item's description without needing to uncheck it | R2 |

---

## NaC Derivation Table

Full traceability chain: JTBD outcome → Journey stage context → NaC → User Story

| NaC-ID | JTBD-ID | JTBD Outcome | Journey Stage Context | Natural Acceptance Criterion | Story | AC Alignment |
|---|---|---|---|---|---|---|
| NaC-01 | JTBD-01.1 | Capture a task in ≤15 seconds with no setup overhead | JRN-01.1:Switch + Type + Submit | Given the app is open, when Jordan types a task title and presses Enter, the task appears in the list immediately — elapsed time from page-open to task visible is under 15 seconds | US-0.1 | ✓ AC: "task appears without page reload"; "input clears after submission" |
| NaC-02 | JTBD-02.2 | Capture a client request in ≤10 seconds mid-focused work | JRN-02.2:Switch + Type + Submit | Given Alex switches to the app mid-session, when she enters a task title and clicks Add, the task is immediately visible — no modal, spinner, or account prompt appears | US-0.2 | ✓ AC: "button submission behaves identically to keyboard submission" |
| NaC-03 | JTBD-01.1 | Return to prior activity with zero data lost | JRN-01.1:Type (validation path) | Given the input is empty, when Jordan presses Enter, an inline error appears and focus stays in the field — no task is created and no navigation occurs | US-0.3 | ✓ AC: "inline error 'Task title is required.'"; "input retains focus" |
| NaC-04 | JTBD-02.2 | Capture confirmed without re-entry | JRN-02.2:Type (validation path) | Given Alex enters a title over 500 characters, when she submits, an inline error appears with the text preserved — she corrects without retyping | US-0.4 | ✓ AC: "entered text is preserved so the user can edit it" |
| NaC-05 | JTBD-01.1 | Task survives browser tab switches and restarts | JRN-01.1:Return (persistence check) | Given Jordan created tasks during the day, when she reloads the page, all tasks appear in the same order — no data is lost between sessions | US-0.5 | ✓ AC: "after full page reload, all previously created tasks appear in the list in the same order" |
| NaC-06 | JTBD-02.1 | Full task list visible in ≤10 seconds on session open | JRN-02.1:Open | Given Alex closed the browser yesterday with tasks saved, when she opens the app today, all tasks appear in their last-known state — no login, no empty state, no re-entry required | US-1.1 | ✓ AC: "app reads tasks from localStorage and renders them"; "renders without requiring any user interaction or login" |
| NaC-07 | JTBD-01.2 | Top 3 priorities identified in ≤60 seconds | JRN-01.2:Scan + Assess | Given the app loads with a mix of completed and incomplete tasks, when Jordan scans the list, completed tasks are visually distinct (strikethrough + muted) — no row needs to be re-read to determine its status | US-1.2 | ✓ AC: "visual distinction is immediately apparent without needing to read the checkbox state" |
| NaC-08 | JTBD-01.1 | App is immediately usable on first open with zero configuration | JRN-01.1:Switch (first-time open) | Given the app loads with no stored tasks, when Jordan opens it for the first time, a clear message indicates she can start adding tasks — the input field is visible and ready | US-1.3 | ✓ AC: "displays the message 'No tasks yet. Add one above.'"; "create input field remains visible" |
| NaC-09 | JTBD-02.1 | Session is never blocked by a broken error state | JRN-02.1:Open (corrupt storage path) | Given localStorage is corrupted or inaccessible, when Alex opens the app, a visible banner explains the limitation — the app never crashes and Alex can still use it | US-1.4 | ✓ AC: "app never crashes or shows an unhandled error due to storage issues"; "persistent banner warning shown" |
| NaC-10 | JTBD-01.3 | Task closed in ≤5 seconds with immediate visual feedback | JRN-01.3:Complete | Given a task is visible in the list, when Jordan clicks the checkbox, the task immediately shows strikethrough + muted styling and the updated state is persisted — no page reload required | US-2.1 | ✓ AC: "UI updates without a page reload"; "strikethrough + muted styling applied immediately" |
| NaC-11 | JTBD-01.3 | Completion correction without delete-and-recreate | JRN-01.3:Complete (undo path) | Given Alex checked a task by mistake, when she clicks the checkbox again, the task immediately returns to incomplete styling — both toggle directions are always permitted | US-2.2 | ✓ AC: "both false→true and true→false toggles are always permitted" |
| NaC-12 | JTBD-01.3 | No silent failures; UI always reflects true state | JRN-01.3:Complete (failure path) | Given a toggle fails because the task no longer exists, when Jordan clicks the checkbox, any optimistic update is reverted and a toast explains the failure — no broken UI state remains | US-2.3 | ✓ AC: "optimistic UI update is reverted"; "toast notification shown" |
| NaC-13 | JTBD-01.3 | Stale task removed in ≤5 seconds with no confirmation dialog | JRN-01.3:Delete | Given a task is no longer relevant, when Jordan clicks the delete control, the task is immediately removed — no confirmation dialog appears and the list re-flows cleanly | US-3.1 | ✓ AC: "no confirmation dialog or prompt is shown before deletion"; "task is removed immediately" |
| NaC-14 | JTBD-02.3 | List pruned without pre-steps regardless of task state | JRN-02.3:Delete Cancelled + Delete Completed Clutter | Given Alex has a mix of complete and incomplete tasks to remove, when she clicks delete on any of them, each is removed in a single action — completed status does not block deletion | US-3.2 | ✓ AC: "delete control is available on all task items regardless of completed status" |
| NaC-15 | JTBD-01.3 | No confusion about whether a task was actually deleted | JRN-01.3:Delete (failure path) | Given a deletion fails, when Jordan clicks delete, the task reappears and a toast is shown — she never believes a task is gone when it was not actually removed from the data store | US-3.3 | ✓ AC: "optimistic removal is reverted and the task reappears in the list"; "toast notification displayed" |
| NaC-16 | JTBD-02.3 | Task title refined in ≤8 seconds without leaving the list | JRN-02.3:Edit Vague Tasks (enter edit) | Given Alex clicks a task's edit trigger, when the inline edit input appears, it is pre-populated with the current title and the cursor is at the end — no modal or navigation occurs | US-4.1 | ✓ AC: "inline text input pre-populated with current task title"; "Save and Cancel buttons shown" |
| NaC-17 | JTBD-01.3 | Corrected task title persisted without navigating away | JRN-01.3:Edit (confirm) | Given Jordan is in inline edit mode, when she presses Enter, the new title immediately replaces the old one in the list and is persisted — she never leaves the task list view | US-4.2 | ✓ AC: "pressing Enter saves the edited title and returns item to View Mode"; "updated title and refreshed updatedAt written to localStorage" |
| NaC-18 | JTBD-02.3 | Edit can be safely abandoned without data loss | JRN-02.3:Edit Vague Tasks (cancel) | Given Alex is in inline edit mode, when she presses Escape or clicks Cancel, the original title is restored and no change is written — she can exit edit mode without accidentally overwriting | US-4.3 | ✓ AC: "pressing Escape discards changes and returns to View Mode with original title"; "no changes made to task on cancel" |
| NaC-19 | JTBD-02.3 | Empty or invalid titles are rejected inline on save | JRN-02.3:Edit Vague Tasks (validation) | Given Alex attempts to save a blank or over-length title while in edit mode, when she presses Enter, an inline error appears and the item stays in Edit Mode — no invalid state is persisted | US-4.4 | ✓ AC: "inline error shown"; "input retains focus on validation failure"; "no changes written on failure" |
| NaC-20 | JTBD-02.3 | Completed task descriptions can be refined without state change | JRN-02.3:Edit Vague Tasks (completed task) | Given a completed task has a vague title, when Alex edits and saves a new title, the task remains visually completed (strikethrough, muted) and only the title changes | US-4.5 | ✓ AC: "editing and saving a completed task's title updates the title without changing its completed status" |

---

## Release Planning

### R1 — Core Workflow (MVP)

**Theme:** Deliver a complete, end-to-end task management experience for both personas. Every journey stage from Arrive through Delete is covered. A user can open the app, see their tasks, capture new ones, mark them done, and remove stale items — all without login or setup.

**Stories included:** US-0.1, US-0.2, US-0.3, US-0.4, US-0.5, US-1.1, US-1.2, US-1.3, US-1.4, US-2.1, US-2.2, US-2.3, US-3.1, US-3.2, US-3.3

**Story count:** 15 (all P0)

**Journey stages covered:**

| Stage | Stories |
|---|---|
| ARRIVE (load + persist) | US-1.1, US-1.3, US-1.4 |
| SCAN (visual differentiation) | US-1.2 |
| CAPTURE (keyboard + button + validation + persist) | US-0.1, US-0.2, US-0.3, US-0.4, US-0.5 |
| SUBMIT & CONFIRM | US-0.5 (persistence) |
| COMPLETE (toggle + unmark + error) | US-2.1, US-2.2, US-2.3 |
| DELETE (instant + any state + error) | US-3.1, US-3.2, US-3.3 |

**Personas served:**

| Persona | Journeys enabled | JTBD addressed |
|---|---|---|
| PER-01 Jordan Mills | JRN-01.1 (full), JRN-01.2 (full), JRN-01.3 (partial — no edit) | JTBD-01.1 (full), JTBD-01.2 (full), JTBD-01.3 (partial — capture, complete, delete) |
| PER-02 Alex Rivera | JRN-02.1 (full), JRN-02.2 (full), JRN-02.3 (partial — no edit) | JTBD-02.1 (full), JTBD-02.2 (full), JTBD-02.3 (partial — delete only) |

**R1 completes these complete journey flows:**
- JRN-01.1 Mid-meeting task capture (all 5 stages)
- JRN-01.2 Morning prioritization scan (all 5 stages)
- JRN-01.3 End-of-day closure (Open, Complete, Delete stages — Edit deferred)
- JRN-02.1 Session resume (all 4 stages)
- JRN-02.2 Client request capture mid-session (all 5 stages)
- JRN-02.3 List pruning (Review + Delete stages — Edit deferred)

---

### R2 — Full Fidelity

**Theme:** Complete the inline editing capability (F4), enabling both personas to refine task titles without leaving the list. This closes the remaining open stages in JRN-01.3 and JRN-02.3, making both journeys fully supported.

**Stories included:** US-4.1, US-4.2, US-4.3, US-4.4, US-4.5

**Story count:** 5 (all P1)

**Journey stages covered:**

| Stage | Stories |
|---|---|
| EDIT (enter mode + save + cancel + validation + completed task) | US-4.1, US-4.2, US-4.3, US-4.4, US-4.5 |

**Personas served:**

| Persona | Journeys completed | JTBD fully addressed |
|---|---|---|
| PER-01 Jordan Mills | JRN-01.3 now complete (Edit stage added) | JTBD-01.3 fully addressed (complete + delete + edit) |
| PER-02 Alex Rivera | JRN-02.3 now complete (Edit Vague Tasks stage added) | JTBD-02.3 fully addressed (edit + delete) |

**R2 completes these journey flows:**
- JRN-01.3 End-of-day closure (Edit stage now covered)
- JRN-02.3 Task refinement and list pruning (Edit Vague Tasks stage now covered)

---

## Coverage Analysis

### Persona Coverage

| Persona | R1 | R2 | Notes |
|---|---|---|---|
| PER-01 Jordan Mills | ✓ Full (4 of 4 journeys partially or fully covered) | ✓ JRN-01.3 completed | No journeys left uncovered after R2 |
| PER-02 Alex Rivera | ✓ Full (4 of 4 journeys partially or fully covered) | ✓ JRN-02.3 completed | No journeys left uncovered after R2 |

### JTBD Coverage

| JTBD-ID | R1 Coverage | R2 Coverage | Notes |
|---|---|---|---|
| JTBD-01.1 | ✓ Full (US-0.1, US-0.3, US-0.5) | — | Capture journey fully addressed in R1 |
| JTBD-01.2 | ✓ Full (US-1.1, US-1.2) | — | Scan/orient journey fully addressed in R1 |
| JTBD-01.3 | ⚠ Partial (US-2.1–2.3, US-3.1, US-3.3 — delete/complete covered; edit deferred) | ✓ Completed (US-4.2, US-4.4) | Fully addressed after R2 |
| JTBD-02.1 | ✓ Full (US-1.1, US-1.2, US-1.4) | — | Session continuity fully addressed in R1 |
| JTBD-02.2 | ✓ Full (US-0.2, US-0.4, US-0.5) | — | Client capture journey fully addressed in R1 |
| JTBD-02.3 | ⚠ Partial (US-3.2 — delete covered; edit deferred) | ✓ Completed (US-4.1, US-4.3, US-4.5) | Fully addressed after R2 |

### Journey Stage Coverage

| Journey | Stage | R1 | R2 |
|---|---|---|---|
| JRN-01.1 | Trigger, Switch, Type, Submit, Return | ✓ All covered | — |
| JRN-01.2 | Open, Scan, Assess, Check, Plan | ✓ All covered | — |
| JRN-01.3 | Open, Complete, Delete, **Edit**, Done | ⚠ Edit stage deferred | ✓ Edit added |
| JRN-02.1 | Open, Scan, Orient, Begin Work | ✓ All covered | — |
| JRN-02.2 | Trigger, Switch, Type, Submit, Return | ✓ All covered | — |
| JRN-02.3 | Review, Delete Cancelled, **Edit Vague Tasks**, Delete Completed Clutter, Done | ⚠ Edit stage deferred | ✓ Edit added |

### Gap Analysis

**Journey stages without coverage after R2:** None — all 6 journeys are fully covered by R1 + R2.

**JTBD outcomes without derived NaC:** None — all 6 JTBD outcomes have at least one derived NaC.

**Orphan stories (not mapped to a journey stage):** None — all 20 stories are placed in the map.

**Unaddressed cross-journey patterns after R2:**
- CP-01 (Instant load) — addressed by US-1.1, US-1.4
- CP-02 (Zero-confirmation delete) — addressed by US-3.1, US-3.2
- CP-03 (Instant task appearance) — addressed by US-0.1, US-0.2, US-0.5
- CP-04 (Visual differentiation) — addressed by US-1.2, US-2.1, US-2.2
- CP-05 (Inline editing without navigation) — addressed by US-4.1–US-4.5

**All 5 cross-journey patterns have coverage. No gaps remaining.**

---

## NaC-to-Acceptance Criteria Mapping

Verifies that each NaC aligns with the corresponding UserStory's acceptance criteria.

| NaC-ID | SM-ID | Story | NaC Statement (summary) | Acceptance Criteria Verified | Alignment |
|---|---|---|---|---|---|
| NaC-01 | SM-0.1 | US-0.1 | Task appears in list in ≤15s via keyboard Enter | "task appears without page reload" + "input clears after submission" | ✓ Full |
| NaC-02 | SM-0.2 | US-0.2 | Task appears instantly via button click | "button submission behaves identically to keyboard submission" | ✓ Full |
| NaC-03 | SM-0.3 | US-0.3 | Empty submit shows inline error; focus stays | "inline error 'Task title is required.'" + "input retains focus" | ✓ Full |
| NaC-04 | SM-0.4 | US-0.4 | Over-length submit shows error; text preserved | "text is preserved so the user can edit it" | ✓ Full |
| NaC-05 | SM-0.5 | US-0.5 | Tasks survive page reload; order preserved | "after full page reload, all previously created tasks appear in the same order" | ✓ Full |
| NaC-06 | SM-1.1 | US-1.1 | Full list visible on load; no login required | "renders without requiring any user interaction or login" | ✓ Full |
| NaC-07 | SM-1.2 | US-1.2 | Completed tasks visually distinct without reading checkbox | "visual distinction is immediately apparent without needing to read the checkbox state" | ✓ Full |
| NaC-08 | SM-1.3 | US-1.3 | Empty state shown with input still visible | "'No tasks yet. Add one above.'" + "create input field remains visible" | ✓ Full |
| NaC-09 | SM-1.4 | US-1.4 | Corrupt storage: banner shown, app stays usable | "app never crashes"; "persistent banner warning shown" | ✓ Full |
| NaC-10 | SM-2.1 | US-2.1 | Completion toggle instant; no reload | "UI updates without a page reload"; "strikethrough + muted styling applied immediately" | ✓ Full |
| NaC-11 | SM-2.2 | US-2.2 | Uncheck restores incomplete state instantly | "both false→true and true→false toggles are always permitted" | ✓ Full |
| NaC-12 | SM-2.3 | US-2.3 | Toggle failure: optimistic update reverted + toast | "optimistic UI update is reverted"; "toast notification shown" | ✓ Full |
| NaC-13 | SM-3.1 | US-3.1 | Delete instant; no confirmation dialog | "no confirmation dialog"; "task is removed immediately" | ✓ Full |
| NaC-14 | SM-3.2 | US-3.2 | Delete works regardless of completion state | "delete control available on all task items regardless of completed status" | ✓ Full |
| NaC-15 | SM-3.3 | US-3.3 | Delete failure: task reappears + toast | "optimistic removal is reverted and the task reappears"; "toast notification displayed" | ✓ Full |
| NaC-16 | SM-4.1 | US-4.1 | Edit mode: inline input pre-populated; no modal | "inline text input pre-populated with current task title" | ✓ Full |
| NaC-17 | SM-4.2 | US-4.2 | Enter saves new title; returns to View Mode | "pressing Enter saves the edited title and returns item to View Mode" | ✓ Full |
| NaC-18 | SM-4.3 | US-4.3 | Escape/Cancel restores original title | "pressing Escape discards changes and returns to View Mode with original title" | ✓ Full |
| NaC-19 | SM-4.4 | US-4.4 | Invalid save rejected; Edit Mode maintained | "inline error shown"; "input retains focus on validation failure" | ✓ Full |
| NaC-20 | SM-4.5 | US-4.5 | Completed task title editable; completion state preserved | "updates the title without changing its completed status" | ✓ Full |

**Result: All 20 NaC statements have full alignment with their corresponding UserStory acceptance criteria. No misalignment found.**

---

## Self-Validation Checklist

- [x] Every UserStory (US-0.1 through US-4.5) appears in the map — **20 of 20**
- [x] Every mapped story has a NaC derived from a specific JTBD outcome — **20 NaC derived**
- [x] NaC Derivation Table has full traceability chains (JTBD-ID → stage → NaC → story) — **20 rows**
- [x] Release planning groups defined — **R1 (15 stories) + R2 (5 stories)**
- [x] Coverage analysis identifies gaps and orphans — **0 gaps, 0 orphans**
- [x] NaC-to-Acceptance Criteria mapping verifies alignment — **20/20 full alignment**
- [x] No orphan stories (unmapped to journey stages)
- [x] Each release enables at least one complete journey — **R1: 4 complete journeys; R2: completes 2 remaining**

---

*STORY-MAP generated: 2026-05-11 | Project: TaskTracker | Version: 1.0 | Source: PERSONAS-TaskTracker.md v1.0, JTBD-TaskTracker.md v1.0, JOURNEYS-TaskTracker.md v1.0, UserStories-TaskTracker.md v1.0, PRD-TaskTracker.md v1.0*
