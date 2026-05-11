# JTBD: Task Tracker App

| Field | Value |
|---|---|
| **Product Name** | Task Tracker App |
| **Project Acronym** | TaskTracker |
| **Version** | 1.0 |
| **Date** | 2026-05-11 |
| **Related Personas** | PERSONAS-TaskTracker.md |
| **Related PRD** | PRD-TaskTracker.md |
| **Status** | Draft |

---

## JTBD Summary Table

| JTBD-ID | Persona | Job Statement (abbreviated) | Priority |
|---|---|---|---|
| JTBD-01.1 | PER-01 Jordan Mills | Capture a task instantly when a thought surfaces mid-workday | P0 |
| JTBD-01.2 | PER-01 Jordan Mills | Scan all outstanding tasks to orient and prioritize the day | P0 |
| JTBD-01.3 | PER-01 Jordan Mills | Mark tasks done and correct stale entries to keep the list actionable | P0 |
| JTBD-02.1 | PER-02 Alex Rivera | Resume work sessions with zero re-entry by relying on a persistent task list | P0 |
| JTBD-02.2 | PER-02 Alex Rivera | Record incoming client requests instantly without leaving the current context | P0 |
| JTBD-02.3 | PER-02 Alex Rivera | Refine task descriptions and prune the list to reflect actual scope | P1 |

---

## PER-01: Jordan Mills — Busy Professional

---

### JTBD-01.1: Instant Task Capture

**Job Statement:**
When a task, reminder, or follow-up surfaces during a meeting, phone call, or browser session, I want to record it in a single action with no setup or navigation overhead, so I can return my attention to the current activity without the thought getting lost.

**Current Alternatives:**
- Scribbles on sticky notes that are later misplaced or discarded
- Types into a notes app not dedicated to tasks — no "done" state, mixes with other content
- Opens a heavyweight PM tool (Jira, Asana) — time-consuming to navigate to a personal task input
- Relies on mental memory, losing tasks between context switches

**Hiring Criteria:**
- Task input is visible and focusable immediately on page load — no clicks to reveal it
- A task can be submitted via keyboard (Enter key) without leaving the keyboard
- Newly added task appears in the list within 100ms — no page reload required
- App is usable on first open with zero configuration or account creation

**Success Measure:** Jordan captures a new task and returns to her prior activity within 15 seconds of opening the app.

**Related Features:** F0, F1
**Priority:** P0

---

### JTBD-01.2: Daily Priority Scan

**Job Statement:**
When I arrive at work or transition between activities, I want to see all my outstanding tasks in one consolidated view, so I can quickly identify what needs attention and sequence my next actions without consulting multiple scattered lists.

**Current Alternatives:**
- Opens 2–3 separate tools (sticky-note board, whiteboard, notes app) and mentally merges them
- Reviews email threads to reconstruct what's outstanding — slow and error-prone
- Relies on memory for personal tasks while using Jira/Asana only for team work — personal items get deprioritized

**Hiring Criteria:**
- All tasks, both completed and incomplete, are visible in a single scrollable list
- Completed tasks are visually distinct from active ones (e.g., strikethrough, muted) without removing them from view
- List loads instantly on page open — no spinner, login prompt, or loading state
- Tasks persist after browser close and reopen — the list is always where Jordan left it

**Success Measure:** Jordan identifies her top 3 priority tasks within 60 seconds of opening the app, without consulting any other tool.

**Related Features:** F1, F2
**Priority:** P0

---

### JTBD-01.3: Task Closure and List Hygiene

**Job Statement:**
When I complete a deliverable or realize a captured task is no longer relevant, I want to mark it done or remove it immediately, so I can maintain a list that reflects only what's actually outstanding and feel a clear sense of progress.

**Current Alternatives:**
- Erases items from a physical whiteboard — irreversible, no history
- Leaves completed items unchecked in notes apps — no visual closure, accumulates noise
- Manually rewrites the list periodically to remove completed items — time-consuming and demotivating
- Corrects typos by deleting and re-creating tasks — loses the intent of the original capture

**Hiring Criteria:**
- Completion toggle updates the task's visual state immediately with no page reload
- Delete action removes a task from the list instantly
- Inline edit allows correcting a task title without losing the task or disrupting list order
- No confirmation dialog required for delete or completion — friction must be zero for routine actions

**Success Measure:** Jordan checks off or deletes a task within 5 seconds of deciding it's done, with no interruption to her workflow.

**Related Features:** F2, F3, F4
**Priority:** P0

---

## PER-02: Alex Rivera — Freelancer / Independent Worker

---

### JTBD-02.1: Session Continuity Without Re-Entry

**Job Statement:**
When I open my browser at the start of a new work session, I want to see my task list exactly as I left it — populated, up to date, and ready to work from — so I can pick up where I left off without spending time reconstructing what needs to be done.

**Current Alternatives:**
- Re-reads email or Slack threads at the start of each session to rebuild a mental task list — inefficient
- Maintains a text file that must be manually updated and is not visually structured for task status
- Uses a productivity app that requires login — abandons it after the login friction repeats
- Accepts the cognitive overhead of remembering tasks across sessions — leads to dropped work

**Hiring Criteria:**
- Task list is fully populated on page load with no login, sync wait, or empty onboarding state
- Data persists across full browser close and reopen (not just tab refresh)
- App is immediately usable on return visits — no "getting started" prompts or tooltips blocking the list
- Completed tasks from previous sessions remain visible and visually differentiated

**Success Measure:** Alex opens the app at the start of a work session and is reviewing an accurate, complete task list within 10 seconds — with zero re-entry required.

**Related Features:** F1, F2
**Priority:** P0

---

### JTBD-02.2: Low-Friction Client Request Capture

**Job Statement:**
When a client message, invoice reminder, or task idea arrives while I'm in the middle of focused work, I want to log it as a task instantly without switching tools or breaking my current context, so I can return to deep work knowing the request is safely recorded.

**Current Alternatives:**
- Switches to a notes app tab, types a note, then must remember to review it later — requires a second system
- Replies to the client email with a note to self — pollutes the inbox with self-reminders
- Attempts to use a productivity app and encounters an empty state or login screen — abandons the capture entirely
- Keeps a physical notepad beside the keyboard — loses notes when working from different locations

**Hiring Criteria:**
- Task creation field is the first interactive element on the page — no navigation required
- Task can be created in under 5 seconds from app open to list confirmation
- App has no onboarding flow, modal overlay, or loading screen between open and task input
- Submitted task is immediately visible in the list — no async delay or success-notification dismissal needed

**Success Measure:** Alex captures an incoming client request as a task within 10 seconds of switching to the app, then switches back to her prior window without losing focus.

**Related Features:** F0, F1
**Priority:** P0

---

### JTBD-02.3: Task Refinement and List Pruning

**Job Statement:**
When a task's scope becomes clearer after initial capture or a client cancels work that was in my list, I want to update the task title precisely or remove it entirely, so I can maintain a list that accurately reflects my real workload and avoid acting on stale or misleading entries.

**Current Alternatives:**
- Deletes and recreates tasks with corrected names — loses the original capture context
- Leaves outdated task names in place and relies on memory to know what was meant — increases cognitive load
- Archives completed or cancelled items in a separate list — creates a second thing to maintain
- Accepts list bloat until a full manual cleanup session — done infrequently, allows drift from reality

**Hiring Criteria:**
- Task title is editable inline without navigating away from the list or opening a modal
- Edit can be confirmed with the Enter key and cancelled with Escape — no mouse required
- Empty task titles are not accepted on save — the app enforces a minimum valid state
- Deleted tasks are removed immediately with no confirmation step — hygiene actions must be instant

**Success Measure:** Alex updates a task title or removes a cancelled task within 8 seconds of identifying the change, with no workflow interruption.

**Related Features:** F3, F4
**Priority:** P1

---

## Outcome-to-Feature Traceability

| JTBD-ID | Related Feature(s) | Expected Outcome |
|---|---|---|
| JTBD-01.1 | F0: Task Creation | Jordan captures a task in ≤15 seconds, returns to prior activity with zero data loss |
| JTBD-01.2 | F1: Task List View, F2: Task Completion | Jordan sees all tasks on load; completed vs. active are instantly distinguishable |
| JTBD-01.3 | F2: Task Completion, F3: Task Deletion, F4: Task Editing | Jordan closes out or corrects tasks in ≤5 seconds with no page reload or modal |
| JTBD-02.1 | F1: Task List View, F2: Task Completion | Alex sees a fully populated, persistent list on every session open — zero re-entry |
| JTBD-02.2 | F0: Task Creation, F1: Task List View | Alex captures a client request in ≤10 seconds; task confirmed in list immediately |
| JTBD-02.3 | F3: Task Deletion, F4: Task Editing | Alex refines or removes a task in ≤8 seconds via inline edit; no empty-title saves permitted |

---

## NaC Preview

> These are candidate Natural Acceptance Criteria derived from job success measures. They will be refined into full acceptance criteria during STORY-MAP generation.

| JTBD-ID | Outcome | Candidate Natural Acceptance Criteria |
|---|---|---|
| JTBD-01.1 | Task captured in ≤15 seconds | Given the app is open, when Jordan types a task title and presses Enter, then the task appears in the list immediately and the input clears — elapsed time from page-open to task visible is under 15 seconds |
| JTBD-01.2 | Top 3 priorities identified in ≤60 seconds | Given the app loads, when Jordan opens it after a browser restart, then her full task list is visible with completed tasks visually distinct — no login or loading state blocks the view |
| JTBD-01.3 | Task closed or corrected in ≤5 seconds | Given a task is visible in the list, when Jordan clicks complete or delete, then the visual state updates instantly with no page reload or confirmation modal |
| JTBD-02.1 | Full list visible in ≤10 seconds on return visit | Given Alex closed the browser yesterday with tasks saved, when she opens the app today, then all previously entered tasks appear in their last-known state — no login, no empty state, no re-entry required |
| JTBD-02.2 | Client request captured in ≤10 seconds | Given Alex is mid-session and switches to the app, when she enters a task title and submits, then the task is immediately visible in the list and she can switch back — no modal, spinner, or account prompt appears |
| JTBD-02.3 | Task title updated or task deleted in ≤8 seconds | Given Alex identifies a task needing correction, when she edits the title inline and presses Enter (or deletes the task), then the updated or removed state is reflected immediately — empty titles are rejected with inline feedback |

---

*JTBD generated: 2026-05-11 | Project: TaskTracker | Version: 1.0 | Source: PERSONAS-TaskTracker.md v1.0, PRD-TaskTracker.md v1.0*
