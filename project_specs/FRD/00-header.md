# FRD: Task Tracker App

**Project:** TaskTracker
**Version:** 1.0
**Date:** 2026-05-11
**Status:** Draft
**Based on PRD:** PRD-TaskTracker.md v1.0

---

## Scope Statement

This Functional Requirements Document specifies the complete behavioral contract for TaskTracker v1 — a lightweight, single-user, browser-based task management application. It covers five features (F00–F04) delivering task creation, list view, completion toggling, deletion, and title editing. No authentication, no server-side user accounts, and no team/collaboration features are in scope for v1. All persistence is handled client-side (localStorage or equivalent browser storage).

---

## Conventions

- **Feature IDs** follow the format `F{nn}` (zero-padded), matching PRD feature numbers. F00 = PRD F0, F01 = PRD F1, etc.
- **Field types** use TypeScript-style notation: `string`, `boolean`, `number`, `ISO8601` (date string), `uuid` (string UUID v4).
- **API surface** in each feature chunk is a summary. Full request/response schemas live in `Y1-api.md`.
- **Schema surface** in each feature chunk is a summary. Full DDL/structure lives in `Y0-schema.md`.
- **Error codes** are `SCREAMING_SNAKE_CASE` strings returned in the API error response body.
- **HTTP status codes** follow REST conventions (200, 201, 400, 404, 422, 500).
- **"Immediate"** means UI updates optimistically without waiting for storage confirmation; storage is synchronous for localStorage.
- **P0** = Critical MVP requirement. **P1** = High priority, included in v1 active scope.

---

## Table of Contents

| Section | File | Feature |
|---------|------|---------|
| F00 | `F00-task-creation.md` | Task Creation |
| F01 | `F01-task-list-view.md` | Task List View |
| F02 | `F02-task-completion.md` | Task Completion |
| F03 | `F03-task-deletion.md` | Task Deletion |
| F04 | `F04-task-editing.md` | Task Editing |
| Y0 | `Y0-schema.md` | Database / Storage Schema |
| Y1 | `Y1-api.md` | REST API Endpoints |
| Y2 | `Y2-errors.md` | Cross-Feature Error Catalog |
| Y3 | `Y3-integrations.md` | Integration Points |

---

## Cross-Cutting Terminology

- **Task:** The core unit of data in the application. A task has a title, a completion status, and system-generated metadata (ID, timestamps).
- **Task ID:** A UUID v4 string that uniquely identifies a task within the user's data store. Generated at creation time; never changes.
- **Task Title:** A non-empty string provided by the user describing the work to be done. Maximum 500 characters.
- **Completion Status:** A boolean flag (`completed: true/false`) indicating whether the task has been marked done.
- **Task List:** The ordered collection of all tasks stored for the user, rendered as the application's primary view.
- **Data Store:** The browser's `localStorage` (or IndexedDB as a fallback). There is no remote database in v1.
- **Inline Editing:** Editing that occurs directly within the list item UI, without navigating away or opening a modal.
- **Optimistic UI Update:** The UI reflects the result of an action immediately, before confirming the data write; for synchronous localStorage, writes complete before re-render.
- **Persist / Persistence:** Writing task state to the data store such that it survives a full page reload.
- **Client-Side API:** For v1, all "API" operations are JavaScript functions operating on localStorage. The API surface described in `Y1-api.md` represents the logical interface contract (callable as REST endpoints if a backend is added later, or as JS module functions in the v1 client-only implementation).

---

*FRD generated: 2026-05-11 | Project: TaskTracker | Version: 1.0*
