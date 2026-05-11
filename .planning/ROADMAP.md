# Roadmap: TaskTracker

## Overview

TaskTracker v1 is a greenfield single-page application delivering five core task management capabilities. The roadmap moves from project scaffold through a working app in four phases: foundation first, then the two requirements that define the core UI (create and view), then the primary task actions (complete and delete), and finally the more complex inline editing interaction. Each phase delivers a coherent, verifiable slice of the product.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Scaffold the React + TypeScript + Vite project, implement the localStorage data layer, and establish the Task data model
- [ ] **Phase 2: Task Capture & Display** - Users can create tasks and see them in a persistent list across browser sessions
- [ ] **Phase 3: Task Actions** - Users can mark tasks complete/incomplete and delete tasks from the list
- [ ] **Phase 4: Task Editing** - Users can edit a task's title inline without leaving the list

## Phase Details

### Phase 1: Foundation
**Status**: awaiting verify
**Goal**: A working project scaffold with the full data layer ready — no user-facing features yet, but everything downstream phases build on
**Depends on**: Nothing (first phase)
**Requirements**: None (infrastructure phase — enables TASK-01 through TASK-05)
**Success Criteria** (what must be TRUE):
  1. `npm run dev` starts a Vite dev server and renders a blank or placeholder React app in the browser
  2. The `Task` TypeScript interface and all API module functions (`getTasks`, `createTask`, `updateTask`, `deleteTask`) are implemented and covered by unit tests
  3. `npm run build` produces a clean `/dist` bundle with no TypeScript errors
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Vite + React + TypeScript project scaffold with CSS Modules, ESLint, Prettier, Vitest
- [ ] 01-02-PLAN.md — Data layer: Task types, UUID utility, localStorage adapter, client API module (TDD)

### Phase 2: Task Capture & Display
**Goal**: Users can capture tasks and see them in a list that persists across browser sessions — the app's core value proposition is functional
**Depends on**: Phase 1
**Requirements**: TASK-01, TASK-02
**Success Criteria** (what must be TRUE):
  1. User can type a task title into the always-visible input field and submit it (via Enter or button); the new task immediately appears at the bottom of the list
  2. Submitting an empty or whitespace-only title shows an inline validation error and does not create a task
  3. All created tasks are visible in the list, ordered oldest-first, showing title and completion status
  4. Tasks survive a full page refresh — reloading the browser does not lose any tasks
  5. When no tasks exist, an empty state message is displayed instead of a blank list
**Plans**: TBD

Plans:
- [ ] 02-01: CreateTaskInput component (F00: input field, submit, validation, inline error)
- [ ] 02-02: TaskList and TaskItem view components (F01: list render, empty state, persistence hydration on load)

### Phase 3: Task Actions
**Goal**: Users can close out finished work and remove unwanted tasks — the task lifecycle is complete
**Depends on**: Phase 2
**Requirements**: TASK-03, TASK-04
**Success Criteria** (what must be TRUE):
  1. User can click a checkbox on any task to mark it complete; the title immediately gains strikethrough and muted styling; the checkbox appears checked
  2. User can click the same checkbox on a completed task to mark it incomplete; the title styling reverts to normal immediately
  3. Completion state persists across page refresh — a completed task remains completed after reload
  4. User can click the delete control on any task and it is immediately removed from the list with no confirmation dialog
  5. Deleting the last task causes the empty state message to appear
**Plans**: TBD

Plans:
- [ ] 03-01: Task completion toggle (F02: checkbox, optimistic UI, persistence)
- [ ] 03-02: Task deletion (F03: delete control, immediate removal, persistence)

### Phase 4: Task Editing
**Goal**: Users can correct and refine task titles inline — the app handles the full task lifecycle from capture through completion
**Depends on**: Phase 3
**Requirements**: TASK-05
**Success Criteria** (what must be TRUE):
  1. User can activate inline editing on any task (via edit icon or title click); the title field becomes an editable input pre-populated with the current title
  2. User can confirm the edit with Enter or a Save button; the updated title is immediately displayed and persisted
  3. User can cancel editing with Escape, a Cancel button, or clicking outside the input; the original title is restored with no changes saved
  4. Attempting to save an empty or whitespace-only title shows an inline error and keeps the edit input active
  5. Only one task can be in edit mode at a time; activating another task's edit silently cancels any open unsaved edit
**Plans**: TBD

Plans:
- [ ] 04-01: Inline task editing (F04: edit mode state, confirm/cancel flows, validation, persistence)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Task Capture & Display | 0/2 | Not started | - |
| 3. Task Actions | 0/2 | Not started | - |
| 4. Task Editing | 0/1 | Not started | - |