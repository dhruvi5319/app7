# PERSONAS: Task Tracker App

| Field | Value |
|---|---|
| **Product Name** | Task Tracker App |
| **Project Acronym** | TaskTracker |
| **Version** | 1.0 |
| **Date** | 2026-05-11 |
| **Related PRD** | PRD-TaskTracker.md |
| **Status** | Draft |

---

## Persona Summary

| ID | Name | Role | Primary Goal |
|---|---|---|---|
| PER-01 | Jordan Mills | Busy Professional | Capture work and personal tasks instantly without switching to a complex tool |
| PER-02 | Alex Rivera | Freelancer / Independent Worker | Maintain a clear, distraction-free task list that persists across work sessions |

---

## PER-01: Jordan Mills — Busy Professional

**Role & Context:**
Jordan is a mid-level marketing coordinator at a software company, juggling a mix of internal projects, client requests, and recurring personal to-dos throughout the day. Jordan works primarily on a laptop in a browser-heavy environment, with 10–15 browser tabs open at any given time. Formal project management tools like Jira or Asana are mandated for team work, but personal task tracking — reminders to follow up on emails, quick errand notes, side deliverables — lives nowhere reliable. Jordan currently rotates between a notes app, a sticky-note board, and a whiteboard that gets erased. Tasks get lost between tools.

Jordan needs something that loads instantly, asks nothing on first use, and makes capturing a thought as fast as writing it down — but with the persistence of a digital tool.

**Goals:**
- Capture tasks in the moment without navigating onboarding or account setup (F0, PRD §3 "speed of interaction")
- See all outstanding tasks in one place without switching between scattered lists (F1)
- Check tasks off as they're completed to maintain a sense of progress (F2)
- Remove tasks that are no longer relevant to keep the list clean (F3)
- Correct task names when a quick capture was imprecise (F4)

**Pain Points:**
- Lightweight task capture is buried under complex tooling — heavy PM tools aren't worth opening for a single personal to-do (PRD §2)
- Simple to-do workflows don't need team collaboration features that slow things down (PRD §2)
- Existing tools optimize for teams, adding setup friction that defeats the purpose for solo use (PRD §2)
- Tasks written on sticky notes or whiteboards disappear — there is no reliable persistence (PRD §2)

**Technical Expertise:** Intermediate — fluent with web apps and browser tools; avoids anything requiring setup, installation, or account creation for quick utilities

**Top Tasks:**
1. Add a new task during a meeting or phone call (multiple times/day — critical speed requirement)
2. Scan the full task list at the start of the day to plan priorities (daily, high frequency)
3. Check off completed tasks at end of day or after wrapping up a deliverable (daily)
4. Delete tasks that were captured in error or are no longer relevant (as-needed)
5. Edit a task title that was captured quickly and needs clarification (occasional)

**Success Criteria:**
- Creates first task within 30 seconds of opening the app with no instruction (PRD §7 Time-to-first-task)
- Zero tasks lost after a page refresh — data always persists (PRD §7 Zero data loss incidents)
- Can add, check, or delete a task without any page reload or modal interruption
- Chooses the app over sticky notes for personal task capture within the first week

---

## PER-02: Alex Rivera — Freelancer / Independent Worker

**Role & Context:**
Alex is a freelance graphic designer and part-time online instructor, operating without a team or a fixed office. Alex works from a home setup — multiple browser tabs, switching frequently between client work, course prep, and administrative tasks. Each "job" is short-lived and context-switches frequently, so task lists go stale fast. Alex has tried productivity apps before and abandoned them after encountering required logins, empty onboarding screens, or feature menus with no obvious starting point. The overhead of learning the tool exceeded the value of using it.

Alex needs a task tracker that is immediately functional on load, persists tasks between browser sessions without login, and stays out of the way during focused work. The tool should feel like a digital notebook — lightweight and always available — not a productivity system to be managed.

**Goals:**
- Keep a single, consolidated list of deliverables and to-dos across clients and personal life (F1)
- Quickly capture new tasks the moment they surface without interrupting the current work context (F0)
- Mark tasks complete to maintain a clear record of what's been delivered (F2)
- Clean up the list regularly by deleting completed or cancelled tasks (F3)
- Fix task names that were captured imprecisely when the scope becomes clearer (F4)

**Pain Points:**
- Most task apps require account creation before any value is delivered — creating friction at the worst moment (PRD §2)
- Complex tooling (sub-tasks, projects, due dates, labels) creates a tool that demands managing rather than using (PRD §2)
- Tasks written in notes apps lack the visual "done" state that mentally closes a loop (PRD §2)
- Prior tool abandonment caused by onboarding flows and empty states — the app has to be usable on first load (PRD §2)

**Technical Expertise:** Intermediate — highly proficient in design and creative software; pragmatic about productivity tools; will abandon any app that requires configuration before delivering value

**Top Tasks:**
1. Review active tasks at the start of a work session to pick up where the day left off (daily, critical)
2. Add a new task when a client request or idea arrives mid-session (multiple times/day)
3. Mark tasks complete after submitting deliverables or finishing a work block (daily)
4. Delete tasks for cancelled work or resolved items to prevent list bloat (weekly)
5. Edit a task title to reflect a refined scope or corrected description (occasional)

**Success Criteria:**
- Opens the app and sees a usable, populated task list without any login or setup on return visits (PRD §7 Retention signal)
- More than 50% of created tasks are marked complete rather than just deleted (PRD §7 Completion rate)
- Returns to the app on more than one day within the first two weeks (PRD §7 Retention signal)
- Does not abandon the app due to friction or onboarding overhead

---

## Persona Relationships

| Interaction | PER-01 Jordan | PER-02 Alex |
|---|---|---|
| **With each other** | No direct interaction — both are solo, single-user contexts | No direct interaction — both are solo, single-user contexts |
| **With the system** | Frequent, high-urgency captures throughout the workday | Session-anchored use — review at start, capture during, close out at end |
| **With data persistence** | Expects tasks to survive browser restarts (passive reliance) | Actively depends on persistence as a substitute for repeated re-entry |
| **With task list** | Uses it as a lightweight safety net alongside heavier team tools | Primary personal task management surface — no backup system |

---

## Feature-Persona Matrix

| Feature | Description | PER-01 Jordan | PER-02 Alex |
|---|---|---|---|
| **F0** | Task Creation | **Primary** — captures tasks rapidly, multiple times/day | **Primary** — core capture mechanic for all incoming work |
| **F1** | Task List View | **Primary** — scans list daily to orient to outstanding work | **Primary** — primary session anchor; reviews list every work session |
| **F2** | Task Completion | **Primary** — checks off tasks to mark deliverables done | **Primary** — closing tasks is the core "done" signal and loop closer |
| **F3** | Task Deletion | **Primary** — removes stale or erroneous tasks to keep list clean | **Primary** — active list hygiene; removes cancelled client work regularly |
| **F4** | Task Editing | **Secondary** — occasional; corrects imprecise captures | **Primary** — regularly refines task names as scope evolves |

**Matrix Key:**
- **Primary** — This persona is a frequent, high-value user of this feature; design and prioritization should center their experience
- **Secondary** — This persona uses this feature but less frequently or with lower stakes
- **None** — Feature does not apply to this persona

---

*PERSONAS generated: 2026-05-11 | Project: TaskTracker | Version: 1.0 | Source: PRD-TaskTracker.md v1.0*
