# JOURNEYS: Task Tracker App

| Field | Value |
|---|---|
| **Product Name** | Task Tracker App |
| **Project Acronym** | TaskTracker |
| **Version** | 1.0 |
| **Date** | 2026-05-11 |
| **Related Personas** | PERSONAS-TaskTracker.md |
| **Related JTBD** | JTBD-TaskTracker.md |
| **Related PRD** | PRD-TaskTracker.md |
| **Status** | Draft |

---

## Journey Index

| JRN-ID | Persona | Scenario | Key JTBD | Stages |
|---|---|---|---|---|
| JRN-01.1 | PER-01 Jordan Mills | Mid-meeting task capture | JTBD-01.1 | 5 |
| JRN-01.2 | PER-01 Jordan Mills | Morning day-start prioritization scan | JTBD-01.2 | 5 |
| JRN-01.3 | PER-01 Jordan Mills | End-of-day task closure and list cleanup | JTBD-01.3 | 5 |
| JRN-02.1 | PER-02 Alex Rivera | Session resume at start of work day | JTBD-02.1 | 4 |
| JRN-02.2 | PER-02 Alex Rivera | Client request capture mid-focused work | JTBD-02.2 | 5 |
| JRN-02.3 | PER-02 Alex Rivera | Task refinement and list pruning | JTBD-02.3 | 5 |

---

## PER-01: Jordan Mills — Busy Professional

---

### JRN-01.1: Mid-Meeting Task Capture

**Persona:** PER-01 (Jordan Mills)

**Scenario:** Jordan is in a back-to-back meeting day. During a client call, the account manager mentions a follow-up she needs to handle before end of week. Jordan has 10 browser tabs open and can't open Jira mid-call without derailing focus. She needs to capture that task in under 15 seconds and return her attention to the conversation — without the thought evaporating.

**Related Jobs:** JTBD-01.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Trigger** | Hears an action item mid-call; mentally flags it | External (phone call) | "I need to remember this or it's gone" | Anxious, slightly pressured | No capture tool immediately at hand; can't write on whiteboard while on camera | App is already open in a pinned browser tab — zero navigation cost |
| **Switch** | Alt-tabs to the Task Tracker browser tab | Browser tab / F0 input | "Please just be there and ready" | Tense, hoping for no friction | Other tools (Jira, Asana) require navigation to find a task input | Task input field is focused automatically on page load — visible immediately |
| **Type** | Types the task title quickly ("Follow up w/ TechCorp re: proposal") | F0 — Task Creation input | "Good enough — I'll fix the wording later" | Focused, slightly hurried | Typos inevitable when typing fast under pressure | Input accepts any text without validation interruption; edit is available later via F4 |
| **Submit** | Presses Enter to save the task | F0 — Submit / F1 — Task List | "Did it save? Let me check fast" | Relieved, but briefly uncertain | If confirmation is not instant, Jordan doubts the capture | Task appears in list within 100ms — no spinner, no success toast to dismiss |
| **Return** | Alt-tabs back to the call within 15 seconds of opening the app | External (meeting) | "Done. Back to it." | Relieved, back in control | None — if the above stages were frictionless | Subtle visual confirmation (task row appears) closes the loop without demanding attention |

#### Key Moments

- **Decision Point:** Switch stage — Jordan decides whether the app is worth opening mid-call. If there is any friction (login prompt, loading spinner, modal), she reverts to a sticky note or accepts the mental loss.
- **Risk of Abandonment:** Submit stage — if the task does not visibly appear in the list immediately, Jordan cannot confirm the capture and loses trust. One failure here triggers a return to pen-and-paper.
- **Delight Opportunity:** Return stage — the task appearing silently and instantly, without demanding any acknowledgment, is the core value. Jordan re-focuses on the call knowing the thought is safe.

#### Success Outcome

Jordan captures a new task and returns to her prior activity within 15 seconds of opening the app, with the task confirmed visible in the list — no page reload, no modal, no login. *(JTBD-01.1 success measure)*

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Switch | F0 (Task Creation — auto-focused input on load) |
| Type | F0 (Task Creation — text input) |
| Submit | F0 (Task Creation — Enter key submit), F1 (Task List View — instant task appearance) |
| Return | F1 (Task List View — task visible, persistent) |

---

### JRN-01.2: Morning Day-Start Prioritization Scan

**Persona:** PER-01 (Jordan Mills)

**Scenario:** Jordan arrives at the office at 8:45 AM. Before her first meeting at 9:15, she has a window to plan the day. She pulls up the task tracker to review everything outstanding and decide what needs to happen today versus what can wait. She has tasks from yesterday that she didn't finish, a few items from earlier in the week, and two she completed but didn't delete. She needs to orient quickly — the 30-minute window is precious.

**Related Jobs:** JTBD-01.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Open** | Opens browser, navigates to the Task Tracker URL or pinned tab | Browser / F1 — Task List | "Show me where I left off" | Calm but expectant | If there is a loading state or login prompt, planning time is immediately wasted | Instant load — full task list visible within 1-2 seconds of page open; no authentication gate |
| **Scan** | Reads through the full task list top to bottom | F1 — Task List View | "OK, what's still open? What did I do yesterday?" | Focused, organizing mentally | Completed and incomplete tasks visually indistinct — forces re-reading each item | Completed tasks are visually muted or struck through; active items are prominent and scannable |
| **Assess** | Mentally groups tasks by urgency; scrolls back to the top | F1 — Task List View | "The TechCorp follow-up is top of mind — and I need to do that budget sheet before EOD" | Slightly anxious about volume | No priority sorting or due dates — ordering relies on task position in the list | Task order reflects capture order; Jordan reads top-to-bottom knowing she added urgent items more recently |
| **Check** | Marks 1-2 tasks complete that were actually finished yesterday but not checked off | F2 — Task Completion | "This one is done — I should have checked it off yesterday" | Slightly frustrated with herself, then relieved | No completion toggle visible without hovering — if the UI hides the control, Jordan misses it | Completion checkbox is always visible per task row, not hidden behind hover state |
| **Plan** | Identifies top 3 tasks to focus on; closes the tab and opens other tools | F1 — Task List View | "OK. TechCorp follow-up, budget sheet, and the onboarding doc. Let's go." | Confident, oriented | None — if the list loaded cleanly and completions were clear | Optional: Jordan bookmarks the app URL or relies on browser tab pinning — no in-app friction |

#### Key Moments

- **Decision Point:** Assess stage — Jordan relies on visual differentiation between complete and incomplete tasks. If completed tasks look identical to active ones, the scan is useless and she must mentally re-evaluate each row.
- **Risk of Abandonment:** Open stage — if the list is empty (data lost) or blocked by a login/onboarding screen, Jordan abandons the app immediately and falls back to email triage.
- **Delight Opportunity:** Scan stage — the experience of seeing all tasks in one place, cleanly organized, is the core differentiator from sticky notes and scattered tools. A well-structured list at load is the "wow" moment for this persona.

#### Success Outcome

Jordan identifies her top 3 priority tasks within 60 seconds of opening the app, without consulting any other tool, with completed tasks visually distinct from active ones. *(JTBD-01.2 success measure)*

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open | F1 (Task List View — instant load, persistent data) |
| Scan | F1 (Task List View — all tasks visible, visual differentiation) |
| Assess | F1 (Task List View — scrollable, readable task titles) |
| Check | F2 (Task Completion — toggle; visual state update) |
| Plan | F1 (Task List View — final scan before closing) |

---

### JRN-01.3: End-of-Day Task Closure and List Cleanup

**Persona:** PER-01 (Jordan Mills)

**Scenario:** It is 5:30 PM. Jordan is wrapping up her workday. She has three deliverables she completed today (drafted a proposal, sent the TechCorp follow-up, submitted expense reports), two tasks she no longer needs (a meeting prep note that's now irrelevant, a duplicate she accidentally added), and one task whose title she typed too fast this morning and needs to clarify before tomorrow. This session is about closing the day cleanly.

**Related Jobs:** JTBD-01.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Open** | Navigates to Task Tracker to close out the day | Browser / F1 — Task List | "Let me check off what I actually did today" | Tired but motivated to close loops | If tasks are missing (data loss), the session starts with alarm instead of closure | Persistent storage ensures the full list is intact exactly as Jordan left it this morning |
| **Complete** | Clicks the completion toggle on 3 tasks she finished today | F2 — Task Completion | "Done, done, done. That feels good." | Progressively more satisfied | If the toggle is small or requires precision, repeated clicking on a tired end-of-day brain is frustrating | Generously-sized click target on completion toggle; immediate visual feedback (strikethrough/mute) |
| **Delete** | Clicks the delete button on 2 stale/irrelevant tasks | F3 — Task Deletion | "These are just noise now — gone." | Relieved, cleaning up | Confirmation dialog would interrupt the cleanup rhythm — each deletion becomes a two-click decision | No confirmation dialog — tasks are removed instantly; list re-flows immediately |
| **Edit** | Double-clicks (or activates inline edit) on one fast-captured task to correct the title | F4 — Task Editing | "What did I even mean by this? Let me fix it for tomorrow." | Mildly amused, then focused | If editing opens a modal or navigates to a new view, the flow breaks — Jordan just wants to fix a few words | Inline edit activates on the task row; Enter confirms, Escape cancels; no navigation required |
| **Done** | Closes the browser tab; feels oriented for tomorrow | Browser (close) | "Tomorrow's list is clean. I'm done." | Satisfied, at ease | None if the above steps were smooth | The act of closing a clean, accurate list is the emotional payoff — no in-app prompt needed |

#### Key Moments

- **Decision Point:** Delete stage — Jordan decides between deletion and leaving stale tasks. If deletion requires confirmation, she may leave tasks rather than deal with the extra click — causing list drift.
- **Risk of Abandonment:** Edit stage — if editing requires a modal, navigation, or multiple steps, Jordan skips it and leaves the imprecise title in place. Future-Jordan will not know what it meant.
- **Delight Opportunity:** Complete stage — checking off three items in rapid succession creates a visible "progress moment." Watching the list visually transform as items are struck through is the emotional reward that makes the app sticky.

#### Success Outcome

Jordan checks off or deletes a task within 5 seconds of deciding it's done, with no page reload, no confirmation modal, and no navigation away from the list. *(JTBD-01.3 success measure)*

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open | F1 (Task List View — persistent, intact) |
| Complete | F2 (Task Completion — toggle, instant visual update) |
| Delete | F3 (Task Deletion — instant removal, no confirmation) |
| Edit | F4 (Task Editing — inline, Enter/Escape, empty-title rejection) |
| Done | F1 (Task List View — clean final state) |

---

## PER-02: Alex Rivera — Freelancer / Independent Worker

---

### JRN-02.1: Session Resume at Start of Work Day

**Persona:** PER-02 (Alex Rivera)

**Scenario:** Alex sits down at her home desk at 9:00 AM after a full browser close the night before. She has three active client projects, a course deadline Friday, and several personal admin items. She has no team standup, no Slack notifications telling her what's urgent — her task list is her sole orientation system. She needs to open the app and immediately know where she left off, with zero re-entry.

**Related Jobs:** JTBD-02.1

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Open** | Opens browser; navigates to Task Tracker (bookmarked or typed from memory) | Browser / F1 — Task List | "Everything should still be there from yesterday" | Quietly hopeful, slightly apprehensive | If there is a login screen, empty state, or "getting started" overlay, Alex's morning begins with friction instead of orientation | Full task list loads immediately on page open — no login gate, no onboarding screen, no empty state |
| **Scan** | Reads the full task list; mentally notes which are complete vs. active | F1 — Task List View | "OK — the logo revisions are still open. I need to send the invoice today. Course module 3 is done." | Settled, progressively oriented | Completed and incomplete tasks look identical — Alex must re-evaluate each task's status from memory | Completed tasks visually distinct (strikethrough + muted); active tasks prominent — status is immediately readable |
| **Orient** | Identifies today's top priorities and the order she'll work | F1 — Task List View | "Invoice first — that's time-sensitive. Then the logo revisions. Module 3 can wait." | Focused, purposeful | No ordering or tagging — priority is inferred from position and memory of recency | Task creation order (most recent at top or bottom) provides implicit priority signal; Alex learns this quickly |
| **Begin Work** | Closes or minimizes the Task Tracker; opens her design tools | External (design software) | "I know what I'm doing today. Let's go." | Confident, ready | None — if the list loaded cleanly and status was clear | Session orientation took under 60 seconds; Alex starts deep work without consulting any other system |

#### Key Moments

- **Decision Point:** Open stage — this is the highest-stakes moment for Alex. If the app shows anything other than her populated task list (login form, empty state, loading screen, onboarding prompt), she will lose trust and revert to her notes-app workaround within the first week.
- **Risk of Abandonment:** Open stage — prior tool abandonment for Alex was triggered exactly here. The app has one chance per session to prove persistence works.
- **Delight Opportunity:** Scan stage — recognizing her tasks exactly as she left them, with completed items cleanly differentiated, is the "this tool gets me" moment that drives retention. It replaces the cognitive overhead of her morning email/Slack triage.

#### Success Outcome

Alex opens the app at the start of a work session and is reviewing an accurate, complete task list within 10 seconds — with zero re-entry required and no login, sync wait, or empty onboarding state. *(JTBD-02.1 success measure)*

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Open | F1 (Task List View — instant load, localStorage persistence across browser close) |
| Scan | F1 (Task List View — all tasks visible), F2 (Task Completion — visual differentiation of complete vs. active) |
| Orient | F1 (Task List View — readable task titles, stable order) |
| Begin Work | F1 (Task List View — passive reference, no active interaction needed) |

---

### JRN-02.2: Client Request Capture Mid-Focused Work

**Persona:** PER-02 (Alex Rivera)

**Scenario:** Alex is deep in a logo revision for a client — 90 minutes into focused work in her design tool. A Slack message arrives: another client needs a revised invoice by tomorrow. Alex does not want to lose her design flow. She has 10-15 seconds to record the invoice task before the notification fades and the thought is lost. She needs to switch to the Task Tracker, type the task, confirm it saved, and return to her design canvas — all without the tool demanding anything from her.

**Related Jobs:** JTBD-02.2

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Trigger** | Sees the Slack message; recognizes the invoice request needs to be captured | External (Slack notification) | "I can't deal with this now but I can't forget it either" | Interrupted, slightly stressed | No capture tool is instantly accessible — must switch apps and hope the tool is ready | Task Tracker is pinned in the browser; switching is a single keyboard shortcut away |
| **Switch** | Alt-tabs to the browser; clicks or activates the Task Tracker tab | Browser / F0 — Task Creation | "Is the input field ready? Can I just start typing?" | Tense, racing the clock on her own attention span | Tool loads to an empty state or requires a click to reveal the input — breaks zero-friction requirement | Task input field is auto-focused on page load; Alex can begin typing the moment the tab activates |
| **Type** | Types "Revised invoice for [client] — due tomorrow" | F0 — Task Creation input | "Short enough, accurate enough. I'll refine later if needed." | Concentrated, slightly rushed | Autocorrect, character limits, or input validation mid-typing interrupt the fast-capture flow | Plaintext input with no in-line validation; only validates on submit (empty-title check) |
| **Submit** | Presses Enter | F0 — Submit / F1 — Task List | "Please be there." | Briefly anxious, then checking | If task does not appear immediately, Alex re-types or doubts the system — loses trust | Task appears in list within 100ms of Enter press; input clears and re-focuses automatically for potential follow-up |
| **Return** | Switches back to design tool; resumes logo revision | External (design software) | "Done. It's recorded. Back to the canvas." | Relieved, refocused | None — if the above stages were clean | The sub-10-second round-trip is what makes the app a viable capture tool during deep work |

#### Key Moments

- **Decision Point:** Switch stage — Alex evaluates in real time whether opening the task tracker is faster than typing in a notes app or just relying on memory. Any friction at load (spinner, modal, login) makes notes-app the winner.
- **Risk of Abandonment:** Submit stage — if Alex is not 100% certain the task was saved, she either re-types it (doubling the interruption) or abandons the capture entirely. Immediate visual confirmation is not optional.
- **Delight Opportunity:** Return stage — completing the round-trip in under 10 seconds and returning to focused work without having lost creative momentum is the experience that makes the tool indispensable. Alex will return tomorrow because it worked today.

#### Success Outcome

Alex captures an incoming client request as a task within 10 seconds of switching to the app, then switches back to her prior window without losing focus. Task is immediately visible in the list; no modal, spinner, or account prompt appears at any point. *(JTBD-02.2 success measure)*

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Switch | F0 (Task Creation — auto-focused input, no navigation to reach it) |
| Type | F0 (Task Creation — plain text input, no mid-type validation) |
| Submit | F0 (Task Creation — Enter key submit), F1 (Task List View — instant task append) |
| Return | F1 (Task List View — task persists, confirmation is visual and silent) |

---

### JRN-02.3: Task Refinement and List Pruning

**Persona:** PER-02 (Alex Rivera)

**Scenario:** It is Thursday afternoon. Alex finishes a client call and learns that a logo project she had in her task list has been cancelled. She also has two tasks captured earlier in the week with vague titles ("client thing" and "module stuff") that now have clear scopes. And her list has grown noisy — five completed tasks from earlier this week are still visible. She allocates 10 minutes before the next work block to bring the list back to an accurate reflection of real, active work.

**Related Jobs:** JTBD-02.3

---

#### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|---|---|---|---|---|---|---|
| **Review** | Scrolls through the full task list to identify what needs updating | F1 — Task List View | "What's stale? What do I actually still need to do?" | Mildly overwhelmed by list clutter, motivated to clean | Completed tasks mixed with active ones make it hard to see what's genuinely outstanding | Completed tasks visually separated (strikethrough + muted) so Alex can focus edits on active tasks |
| **Delete Cancelled** | Clicks the delete button on the cancelled logo project task | F3 — Task Deletion | "That project is dead. Remove it." | Decisive, efficient | Confirmation dialog forces a two-step action for a decision Alex has already made | Task deleted instantly on click — no confirmation step; list re-flows without visual jump |
| **Edit Vague Tasks** | Activates inline edit on "client thing"; types "Revised fee proposal for Studio Kora"; presses Enter. Repeats for "module stuff" → "Record Module 3 intro video" | F4 — Task Editing | "I know what these are now. Let me name them properly." | Focused, deliberate | If edit opens a modal, navigates away, or does not support keyboard confirm/cancel, Alex breaks flow and may abandon mid-edit | Click-to-edit activates inline; Enter confirms; Escape cancels; updated title replaces old immediately in the list |
| **Delete Completed Clutter** | Deletes 5 completed tasks she no longer needs in the list | F3 — Task Deletion | "I marked these done already — they're just taking up space now." | Methodical, satisfaction building | Rapid successive deletions become tedious if each delete triggers a visual jitter or confirmation | Each deletion is instant and smooth; the list re-compresses cleanly after each removal |
| **Done** | Surveys the cleaned list; closes the browser to focus on next task block | F1 — Task List View | "Seven items. All active. All accurate. Good." | Satisfied, clear-headed | None — if edit and delete worked smoothly | A small, accurate, clean task list is the intended end state — the app has helped Alex maintain grip on her real workload |

#### Key Moments

- **Decision Point:** Edit Vague Tasks stage — Alex decides whether to fix the imprecise titles or leave them. If editing is any more than a double-click + type + Enter, she abandons the correction and accepts list ambiguity — a slow erosion of the list's usefulness.
- **Risk of Abandonment:** Delete Cancelled stage — if the delete action requires a confirmation, the pace of cleanup drops and the list hygiene session feels laborious. Alex stops partway through and lives with a cluttered list.
- **Delight Opportunity:** Done stage — looking at a small, accurate, well-named task list is a disproportionately satisfying experience. This moment reinforces the habit loop: capture → work → clean → repeat. The cleanliness of the list is what brings Alex back.

#### Success Outcome

Alex updates a task title or removes a cancelled task within 8 seconds of identifying the change, with inline editing that accepts keyboard confirm/cancel and rejects empty titles. *(JTBD-02.3 success measure)*

#### Feature Touchpoints

| Stage | Features |
|---|---|
| Review | F1 (Task List View — full list scan, visual status differentiation) |
| Delete Cancelled | F3 (Task Deletion — instant, no confirmation) |
| Edit Vague Tasks | F4 (Task Editing — inline, Enter to confirm, Escape to cancel, empty-title rejection) |
| Delete Completed Clutter | F3 (Task Deletion — rapid successive deletes, smooth list re-flow) |
| Done | F1 (Task List View — clean, accurate final state) |

---

## Cross-Journey Patterns

### CP-01: Instant Load with Populated State is Non-Negotiable

Every journey begins with the user opening the app expecting it to be ready. In **JRN-01.2**, **JRN-01.3**, **JRN-02.1**, and **JRN-02.3**, the list must load with all previously captured tasks immediately visible. Any loading state, login screen, or empty onboarding screen at this stage triggers abandonment for both personas — the pain point is identical despite the different role contexts. **This is the single highest-risk moment across all journeys.**

**Shared Opportunity:** Browser-local persistence (localStorage or equivalent) must be reliable across full browser close and reopen — not just tab refresh. This is explicitly validated in every return-visit journey stage.

---

### CP-02: Zero-Confirmation Delete is a Shared Requirement

Both personas delete tasks as a hygiene action, not a reversible decision. In **JRN-01.3** (Jordan cleaning up stale items), **JRN-02.3** (Alex pruning cancelled and completed tasks), and implicitly in any cleanup session, a confirmation dialog converts a one-click action into a two-click decision. Both personas stop cleaning partway through when confirmation adds friction. The PRD explicitly rules this out for v1 (§5 F3).

**Shared Opportunity:** Remove the confirmation step entirely. Stale task deletion is low-stakes for solo users — these personas are not deleting shared team work with downstream consequences.

---

### CP-03: Instant Task Appearance After Submit Drives Trust

In **JRN-01.1** and **JRN-02.2** — the two mid-activity capture journeys — both personas check whether the task appeared in the list before switching away. If the appearance is delayed (async save, spinner, toast notification to dismiss), neither user can confirm the capture was successful. Both personas express the same internal monologue: "Did it save?"

**Shared Opportunity:** Task append to the list must be synchronous from the user's perspective (<100ms). Input clears automatically after submit. No success-state modal or toast notification requires dismissal — silent, immediate visual confirmation is the correct pattern.

---

### CP-04: Visual Differentiation Between Complete and Active Tasks is a Daily Requirement

In **JRN-01.2** (Jordan's morning scan), **JRN-02.1** (Alex's session resume), and **JRN-02.3** (Alex's cleanup), both personas depend on the completed/active visual distinction to read the list efficiently. Without it, every scan requires re-reading every task to mentally reconstruct its status — eliminating the core time-saving value of a consolidated list.

**Shared Opportunity:** Completed tasks should be struck through AND visually muted (reduced opacity or secondary color) — two visual signals, not one. This serves both the fast-scanning professional and the multi-context freelancer.

---

### CP-05: Inline Editing Without Navigation is Required for Both Personas

In **JRN-01.3** (Jordan correcting a fast-captured task) and **JRN-02.3** (Alex refining vague titles), both personas explicitly skip the edit if it requires navigating away from the list, opening a modal, or using a mouse exclusively. The shared pattern: click-to-edit (or double-click), type correction, Enter to confirm, Escape to cancel — all without leaving the task list view.

**Shared Opportunity:** F4 (Task Editing) must be fully keyboard-operable. The Enter/Escape pattern is learned behavior from browser and OS text fields — meeting this expectation is baseline usability, not a delight feature.

---

## Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|---|---|---|---|
| JRN-01.1 | Switch | JTBD-01.1 | App loads instantly with input focused — zero clicks to reach task creation |
| JRN-01.1 | Type | JTBD-01.1 | Plaintext input accepts any title without mid-type interruption |
| JRN-01.1 | Submit | JTBD-01.1 | Task appears in list within 100ms of Enter press; input clears |
| JRN-01.1 | Return | JTBD-01.1 | Task persists — Jordan confident the thought is safely recorded |
| JRN-01.2 | Open | JTBD-01.2 | Full task list visible within seconds; no login or empty state |
| JRN-01.2 | Scan | JTBD-01.2 | Completed vs. active tasks visually distinct; scan is fast |
| JRN-01.2 | Check | JTBD-01.2 | Completion toggle visible per row; updates immediately on click |
| JRN-01.3 | Complete | JTBD-01.3 | Completion toggle triggers immediate visual change; no reload |
| JRN-01.3 | Delete | JTBD-01.3 | Task removed instantly; no confirmation dialog |
| JRN-01.3 | Edit | JTBD-01.3 | Inline edit activates; Enter confirms, Escape cancels; empty title rejected |
| JRN-02.1 | Open | JTBD-02.1 | List fully populated after full browser close — zero re-entry required |
| JRN-02.1 | Scan | JTBD-02.1 | Completed and active tasks are visually differentiated; status readable at a glance |
| JRN-02.1 | Orient | JTBD-02.1 | Task titles are readable; Alex identifies priorities within 60 seconds |
| JRN-02.2 | Switch | JTBD-02.2 | App tab activates with input auto-focused; no click required to begin typing |
| JRN-02.2 | Submit | JTBD-02.2 | Task appears in list within 100ms; no async delay, no spinner to wait for |
| JRN-02.2 | Return | JTBD-02.2 | Alex switches back within 10 seconds; no prompt or modal holds her in the app |
| JRN-02.3 | Delete Cancelled | JTBD-02.3 | Cancelled task removed instantly; no confirmation step |
| JRN-02.3 | Edit Vague Tasks | JTBD-02.3 | Inline edit activates; title updated without navigating away from list |
| JRN-02.3 | Delete Completed Clutter | JTBD-02.3 | Rapid successive deletes complete cleanly; list re-flows after each removal |
| JRN-02.3 | Done | JTBD-02.3 | Clean, accurate list reflects only real active work — no stale or vague entries remain |

---

*JOURNEYS generated: 2026-05-11 | Project: TaskTracker | Version: 1.0 | Source: PERSONAS-TaskTracker.md v1.0, JTBD-TaskTracker.md v1.0, PRD-TaskTracker.md v1.0*
