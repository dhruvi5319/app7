# Technical Architecture: Task Tracker App

**Project:** TaskTracker
**Version:** 1.0
**Date:** 2026-05-11
**Status:** Draft
**Based on:** PRD-TaskTracker.md v1.0, FRD-TaskTracker.md v1.0

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture)
3. [Data Model](#3-data-model)
4. [API Design](#4-api-design)
5. [Security Architecture](#5-security-architecture)
6. [Technology Stack](#6-technology-stack)
7. [Integration Points](#7-integration-points)

---

## 1. Architectural Overview

### Pattern: Single-Page Application (SPA) with Client-Side Persistence

TaskTracker v1 is a **client-only single-page application**. There is no backend server, no database server, and no network requests. All state is managed in-memory during the session and persisted to the browser's `localStorage` between sessions. This architecture directly satisfies the PRD constraints: no authentication, no server infrastructure, and instant UI interactions.

The design intentionally mirrors a REST API contract (documented in Section 4) so that a backend can be introduced post-v1 by replacing the localStorage module functions with HTTP calls — without changing any feature logic.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         Browser                                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    React SPA (UI Layer)                   │   │
│  │                                                           │   │
│  │  ┌─────────────────┐    ┌──────────────────────────────┐ │   │
│  │  │   App Shell     │    │        Task List View         │ │   │
│  │  │  (layout,       │    │  ┌──────────────────────────┐ │ │   │
│  │  │   error         │    │  │  CreateTaskInput (F00)   │ │ │   │
│  │  │   boundaries)   │    │  ├──────────────────────────┤ │ │   │
│  │  └─────────────────┘    │  │  TaskItem × N            │ │ │   │
│  │                         │  │  ├─ Checkbox   (F02)     │ │ │   │
│  │                         │  │  ├─ Title/Edit (F04)     │ │ │   │
│  │                         │  │  └─ DeleteBtn  (F03)     │ │ │   │
│  │                         │  ├──────────────────────────┤ │ │   │
│  │                         │  │  EmptyState              │ │ │   │
│  │                         │  └──────────────────────────┘ │ │   │
│  │                         └──────────────────────────────┘ │   │
│  └───────────────────────────────┬──────────────────────────┘   │
│                                   │ call                          │
│  ┌────────────────────────────────▼──────────────────────────┐  │
│  │              Client API Module  (src/api/tasks.ts)         │  │
│  │   getTasks() · createTask() · updateTask() · deleteTask()  │  │
│  └────────────────────────────────┬──────────────────────────┘  │
│                                   │ read/write                    │
│  ┌────────────────────────────────▼──────────────────────────┐  │
│  │          Browser localStorage                              │  │
│  │          key: "tasktracker_tasks"  →  JSON string          │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### Deployment Topology

```
Developer machine
      │
      ▼
  npm run build
      │
      ▼
  /dist  (static HTML + JS + CSS bundle)
      │
      ├──► Static hosting (Netlify / Vercel / GitHub Pages / S3+CloudFront)
      │         No server process required
      │         No environment variables required
      │         CDN serves assets globally
      │
      └──► Local development: npm run dev  (Vite dev server, localhost:5173)
```

### Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| Client-only, no backend | PRD explicitly excludes server-side in v1; simplest path to usable product |
| localStorage as data store | Persistent across refreshes; no setup; universally available in target browsers |
| REST-shaped client API module | Mirrors future backend contract; swappable without UI changes |
| React SPA | Component model fits reactive list UI; wide ecosystem; easy inline editing state |
| Vite as build tool | Fast HMR; zero-config for React + TypeScript; small bundle output |
| TypeScript throughout | Type-safe data model prevents schema drift; interfaces double as docs |

---

## 2. Component Architecture

### Backend Components

There is no backend in v1. The "backend" is a TypeScript module that implements the API contract against localStorage.

#### `src/api/tasks.ts` — Client API Layer

The central module implementing the logical API surface. All feature logic routes through this module. UI components never access `localStorage` directly.

| Function | Signature | Description |
|----------|-----------|-------------|
| `getTasks` | `() => Task[]` | Read and deserialize all tasks from localStorage, sorted by `createdAt` ASC |
| `createTask` | `(title: string) => Task` | Validate, generate ID/timestamps, append to store, return new task |
| `updateTask` | `(id: string, patch: Partial<Pick<Task, 'title' \| 'completed'>>) => Task` | Apply partial update, refresh `updatedAt`, persist |
| `deleteTask` | `(id: string) => void` | Remove task by ID, persist remaining array |

#### `src/storage/localStorage.ts` — Storage Adapter

Thin wrapper around `window.localStorage` that handles serialization, parse errors, and storage exceptions. Throws typed errors (`StorageReadError`, `StorageWriteError`) that the API layer catches and maps to error codes.

#### `src/lib/uuid.ts` — UUID Generator

Wraps `crypto.randomUUID()` with a polyfill fallback for environments where it is unavailable.

---

### Frontend Components

```
src/
├── App.tsx                         Root component; holds task list state
├── components/
│   ├── TaskList/
│   │   ├── TaskList.tsx            Renders ordered list of TaskItem; handles empty state
│   │   └── TaskList.module.css
│   ├── TaskItem/
│   │   ├── TaskItem.tsx            Single row: checkbox + title/edit input + delete button
│   │   └── TaskItem.module.css
│   ├── CreateTaskInput/
│   │   ├── CreateTaskInput.tsx     Always-visible input + Add Task button at top of list
│   │   └── CreateTaskInput.module.css
│   ├── EmptyState/
│   │   └── EmptyState.tsx          "No tasks yet" illustration and message
│   └── ui/
│       ├── Toast.tsx               Auto-dismissing toast notification (3–5s)
│       ├── Banner.tsx              Persistent top-of-page warning banner
│       └── InlineError.tsx         Field-level validation error message
├── api/
│   └── tasks.ts                    Client API module (see above)
├── storage/
│   └── localStorage.ts             Storage adapter
├── lib/
│   └── uuid.ts                     UUID generator
└── types/
    └── task.ts                     TypeScript interfaces (Task, API request/response types)
```

#### Component Responsibilities

| Component | Responsibilities |
|-----------|-----------------|
| `App.tsx` | Owns `tasks: Task[]` state; loads from API on mount; passes tasks + handlers down; renders Banner on `STORAGE_READ_FAILED` |
| `TaskList` | Maps `tasks` array to `TaskItem` elements; renders `EmptyState` when array is empty; preserves `createdAt` sort order |
| `TaskItem` | Manages local `isEditing` boolean state; renders View Mode or Edit Mode; calls `onToggle`, `onEdit`, `onDelete` callbacks |
| `CreateTaskInput` | Manages local `inputValue` and `error` state; calls `onCreate` callback on valid submit; shows `InlineError` on validation failure |
| `Toast` | Accepts `message` + optional `duration`; auto-dismisses; stacked via portal |
| `Banner` | Persistent warning; not dismissable in v1 |

---

## 3. Data Model

### Entity Overview

TaskTracker v1 has a single entity: **Task**. There are no relations, no foreign keys, and no secondary collections. The entire data model is one flat object type stored as a JSON array.

### ER Diagram

```
┌──────────────────────────────────────────┐
│                   TASK                   │
├──────────────────────────────────────────┤
│  id          VARCHAR(36)  PK             │
│  title       VARCHAR(500) NOT NULL       │
│  completed   BOOLEAN      NOT NULL       │
│  created_at  TIMESTAMP    NOT NULL       │
│  updated_at  TIMESTAMP    NOT NULL       │
└──────────────────────────────────────────┘

(Single entity — no relationships in v1)
```

### localStorage Schema

**Key:** `tasktracker_tasks`
**Value type:** JSON-serialized `Task[]` array

**Example stored value:**
```json
[
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T09:00:00.000Z"
  },
  {
    "id": "3c162b5f-7a3e-4b5d-9f1a-2d8e0f4c6a11",
    "title": "Write weekly report",
    "completed": true,
    "createdAt": "2026-05-11T10:30:00.000Z",
    "updatedAt": "2026-05-11T14:15:00.000Z"
  }
]
```

### Field Specifications

| Field | Type (TS) | Type (SQL) | Constraints | Mutability |
|-------|-----------|------------|-------------|------------|
| `id` | `string` (UUID v4) | `VARCHAR(36)` | Primary key; unique; non-null | Immutable after creation |
| `title` | `string` | `VARCHAR(500)` | Non-empty after trim; max 500 chars; non-null | Mutable (F04) |
| `completed` | `boolean` | `BOOLEAN` | `true` or `false`; default `false`; non-null | Mutable (F02) |
| `createdAt` | `string` (ISO 8601) | `TIMESTAMP` | Set at creation; non-null | Immutable after creation |
| `updatedAt` | `string` (ISO 8601) | `TIMESTAMP` | Set at creation; refreshed on every mutation | Mutable (F02, F04) |

### Relational DDL (Future Backend Reference)

The following SQL DDL is the exact schema to use if a backend database is introduced post-v1. The field names and constraints are derived directly from the FRD storage schema. The column names use `snake_case` per SQL convention; the client-side JSON uses `camelCase` per JavaScript convention.

```sql
-- ============================================================
-- TaskTracker v1 — Database Schema
-- Target: PostgreSQL 15+ (also compatible with SQLite 3.35+)
-- Generated: 2026-05-11
-- ============================================================

-- Drop and recreate for clean migrations (dev/CI use only)
-- DROP TABLE IF EXISTS tasks;

CREATE TABLE tasks (
    id          VARCHAR(36)   NOT NULL,                -- UUID v4, generated client-side
    title       VARCHAR(500)  NOT NULL,                -- Task title; trimmed; non-empty
    completed   BOOLEAN       NOT NULL DEFAULT FALSE,  -- Completion status
    created_at  TIMESTAMP     NOT NULL,                -- Creation time (UTC, ISO 8601)
    updated_at  TIMESTAMP     NOT NULL,                -- Last mutation time (UTC, ISO 8601)

    CONSTRAINT tasks_pkey         PRIMARY KEY (id),
    CONSTRAINT tasks_title_check  CHECK (char_length(trim(title)) > 0)
);

-- Index: default list sort order (createdAt ASC)
CREATE INDEX idx_tasks_created_at
    ON tasks (created_at ASC);

-- Index: filter by completion status (future filtering use)
CREATE INDEX idx_tasks_completed
    ON tasks (completed);

-- Comments
COMMENT ON TABLE  tasks               IS 'Core task entity — single user, v1';
COMMENT ON COLUMN tasks.id            IS 'UUID v4 generated client-side at creation';
COMMENT ON COLUMN tasks.title         IS 'User-provided task description; max 500 chars; trimmed';
COMMENT ON COLUMN tasks.completed     IS 'false = incomplete, true = complete';
COMMENT ON COLUMN tasks.created_at    IS 'UTC timestamp of task creation; immutable';
COMMENT ON COLUMN tasks.updated_at    IS 'UTC timestamp of last mutation (toggle or edit)';
```

### Data Integrity Rules

- The stored array is always a valid JSON array. An empty task list is `[]`, never `null` or absent.
- `id` values within the array must be unique. On read, if a duplicate `id` is detected, the first occurrence is retained and subsequent duplicates are discarded silently.
- The full array is written atomically on every mutation (read → modify → write). Partial writes are not possible with `localStorage.setItem`.
- On parse error (`STORAGE_CORRUPT`), the app initializes with `[]` and continues. No user-facing error is shown.
- Tasks missing required fields (`id`, `title`, `completed`) are skipped during render without crashing.

---

## 4. API Design

### Overview

The API surface is implemented as TypeScript module functions in `src/api/tasks.ts` for v1. The function signatures follow REST semantics exactly so that a future backend migration replaces only the transport layer.

### TypeScript Interfaces

```typescript
// src/types/task.ts

/** Core task entity */
export interface Task {
  id: string;         // UUID v4 — unique identifier, immutable after creation
  title: string;      // Non-empty string, max 500 chars, trimmed
  completed: boolean; // false = incomplete, true = complete
  createdAt: string;  // ISO 8601 datetime string (UTC)
  updatedAt: string;  // ISO 8601 datetime string (UTC), refreshed on every mutation
}

/** POST /api/tasks — request body */
export interface CreateTaskRequest {
  title: string;      // Required; non-empty after trim; max 500 chars
}

/** PATCH /api/tasks/:id — request body (partial update) */
export interface UpdateTaskRequest {
  title?: string;     // If present: non-empty after trim; max 500 chars
  completed?: boolean; // If present: true or false
}

/** Success response wrapper */
export interface ApiSuccessResponse<T> {
  data: T;
}

/** Error response wrapper */
export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
  };
}

/** All error codes used in TaskTracker v1 */
export type ErrorCode =
  | 'TITLE_REQUIRED'
  | 'TITLE_TOO_LONG'
  | 'TASK_NOT_FOUND'
  | 'STORAGE_READ_FAILED'
  | 'STORAGE_WRITE_FAILED'
  | 'STORAGE_CORRUPT'
  | 'INVALID_FIELD';
```

### Endpoint Reference

#### GET /api/tasks — Retrieve All Tasks

Reads all tasks from localStorage, sorted by `createdAt` ascending.

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/tasks` |
| Auth | None |
| Request body | None |
| Query params | None (filtering deferred to post-v1) |

**Response 200 OK:**
```json
{
  "data": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "title": "Buy groceries",
      "completed": false,
      "createdAt": "2026-05-11T09:00:00.000Z",
      "updatedAt": "2026-05-11T09:00:00.000Z"
    }
  ]
}
```
Returns `{ "data": [] }` when no tasks exist (not a 404).

**Error Responses:**

| Status | Error Code | Condition |
|--------|------------|-----------|
| 500 | `STORAGE_READ_FAILED` | `localStorage.getItem()` throws `SecurityError` |

---

#### POST /api/tasks — Create a Task

Validates, generates task fields, appends to store, returns new task.

| Property | Value |
|----------|-------|
| Method | `POST` |
| Path | `/api/tasks` |
| Auth | None |
| Content-Type | `application/json` |

**Request body:**
```json
{ "title": "Buy groceries" }
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | Non-empty after trim; max 500 chars |

**Response 201 Created:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T09:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Error Code | Condition |
|--------|------------|-----------|
| 422 | `TITLE_REQUIRED` | `title` absent, empty, or whitespace-only after trim |
| 422 | `TITLE_TOO_LONG` | `title` exceeds 500 characters after trim |
| 500 | `STORAGE_WRITE_FAILED` | `localStorage.setItem()` throws `QuotaExceededError` or `SecurityError` |

---

#### PATCH /api/tasks/:id — Update a Task

Partial update. Only fields present in the request body are modified. `id` and `createdAt` are immutable and ignored if included. `updatedAt` is always refreshed on any successful mutation.

| Property | Value |
|----------|-------|
| Method | `PATCH` |
| Path | `/api/tasks/:id` |
| Auth | None |
| Content-Type | `application/json` |

**Path Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Request body examples:**

Toggle completion:
```json
{ "completed": true }
```

Update title:
```json
{ "title": "Buy groceries and cook dinner" }
```

Update both:
```json
{ "title": "Buy groceries and cook dinner", "completed": true }
```

**Partial update behavior:**

| Body contains | Effect |
|--------------|--------|
| `{ "completed": true }` | Updates `completed` + refreshes `updatedAt` |
| `{ "title": "New title" }` | Updates `title` + refreshes `updatedAt` |
| `{ "title": "New title", "completed": true }` | Updates both + refreshes `updatedAt` |
| `{}` (empty body) | No-op; returns 200 with unchanged task |

**Response 200 OK:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries and cook dinner",
    "completed": true,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

| Status | Error Code | Condition |
|--------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists in the store |
| 422 | `TITLE_REQUIRED` | `title` present in body but empty or whitespace-only after trim |
| 422 | `TITLE_TOO_LONG` | `title` exceeds 500 characters after trim |
| 422 | `INVALID_FIELD` | `completed` is not a boolean |
| 500 | `STORAGE_WRITE_FAILED` | `localStorage.setItem()` throws |

---

#### DELETE /api/tasks/:id — Delete a Task

Permanently removes a task from the store. Irreversible; no confirmation required.

| Property | Value |
|----------|-------|
| Method | `DELETE` |
| Path | `/api/tasks/:id` |
| Auth | None |
| Request body | None |

**Path Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Response 204 No Content:**
- Empty body.

**Error Responses:**

| Status | Error Code | Condition |
|--------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | Task ID not found (v1 client treats as silent success — idempotent) |
| 500 | `STORAGE_WRITE_FAILED` | `localStorage.setItem()` throws during write-back |

---

### Client-Side Module Function Signatures

```typescript
// src/api/tasks.ts

import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types/task';

/** Load all tasks from localStorage, sorted by createdAt ASC. */
export function getTasks(): Task[];

/** Create a new task. Throws TaskrError on validation or storage failure. */
export function createTask(req: CreateTaskRequest): Task;

/** Partially update a task by ID. Throws TaskrError on not-found, validation, or storage failure. */
export function updateTask(id: string, patch: UpdateTaskRequest): Task;

/** Delete a task by ID. Idempotent — no error if already absent. */
export function deleteTask(id: string): void;
```

---

## 5. Security Architecture

### Authentication

**None in v1.** TaskTracker is a single-user, no-login application. There are no credentials, sessions, tokens, or user accounts. The PRD explicitly scopes this out.

### Authorization

**Not applicable in v1.** There is only one implicit "user" — whoever is operating the browser. All data in localStorage is accessible only to the origin (`window.localStorage` is origin-scoped by the browser).

### Data Protection

| Concern | v1 Approach |
|---------|-------------|
| Data isolation | Browser enforces same-origin policy; no other origin can read `tasktracker_tasks` from localStorage |
| Data in transit | No network transmission; all data stays local — no TLS/HTTPS requirement for data security (HTTPS still recommended for serving static assets) |
| Data at rest | localStorage is stored unencrypted on the user's device; no PII beyond user-typed task titles |
| XSS protection | React's JSX escapes rendered content by default; no `dangerouslySetInnerHTML` usage; all user input rendered as text nodes |
| Input sanitization | Title input is trimmed and length-capped before storage; no HTML or script interpretation |
| Storage exhaustion | `QuotaExceededError` caught and surfaced as `STORAGE_WRITE_FAILED`; no silent data loss |
| Private browsing | `SecurityError` on localStorage access is caught; app renders with empty list and persistent warning banner |

### Content Security Policy (Recommended)

When serving the static assets, configure the following CSP header:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'none';
  frame-ancestors 'none';
```

`connect-src 'none'` is correct for v1 since there are no outbound network requests from the application.

### Post-v1 Security Considerations

When a backend is added, the following must be introduced:
- HTTPS enforcement for all API traffic
- JWT or session-based authentication
- Server-side input validation (do not trust client-side validation alone)
- CSRF protection for state-mutation endpoints
- Rate limiting on task creation

---

## 6. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **UI Framework** | React | 18.x | Component-based SPA; reactive state management |
| **Language** | TypeScript | 5.x | Type safety; interfaces as living documentation |
| **Build Tool** | Vite | 5.x | Fast HMR in dev; optimized static bundle for prod |
| **Styling** | CSS Modules | (built into Vite) | Scoped component styles; no runtime CSS-in-JS overhead |
| **Persistence** | Browser localStorage | Native browser API | Client-side task persistence across sessions |
| **UUID Generation** | `crypto.randomUUID()` | Native browser API | Generates task IDs; UUID v4 polyfill as fallback |
| **Testing** | Vitest | 1.x | Unit tests for API module and component logic |
| **Component Testing** | React Testing Library | 14.x | Behavioral UI tests |
| **Linting** | ESLint + typescript-eslint | 8.x / 7.x | Code quality; type-aware linting rules |
| **Formatting** | Prettier | 3.x | Consistent code style |
| **Package Manager** | npm | 10.x | Dependency management |
| **Deployment** | Static hosting (Netlify/Vercel/GitHub Pages) | — | Serves `/dist` bundle; no server required |

### Key Dependency Decisions

| Decision | Rationale |
|----------|-----------|
| No state management library (Redux/Zustand) | Single entity, single list — React's `useState` + prop drilling is sufficient for v1 complexity |
| No UI component library | Avoids bundle bloat and style conflicts for a focused app with minimal components |
| No routing library | Single-view app; no URL-based navigation needed |
| No date library (dayjs/moment) | `Date.prototype.toISOString()` is sufficient for ISO 8601 timestamp generation |
| CSS Modules over Tailwind | Avoids large utility class sets for an app with few components; keeps styles colocated and explicit |

---

## 7. Integration Points

### v1 Browser API Dependencies

TaskTracker v1 has **no external service integrations**. It depends solely on browser-native APIs.

| Browser API | Usage | Error Handling |
|-------------|-------|----------------|
| `window.localStorage` | Primary persistence — read/write all tasks as JSON under key `tasktracker_tasks` | `SecurityError` → `STORAGE_READ_FAILED` banner + disable writes; `QuotaExceededError` on write → `STORAGE_WRITE_FAILED` toast |
| `crypto.randomUUID()` | Generate UUID v4 for task `id` at creation | Polyfill fallback if unavailable (old browsers) |
| `Date.prototype.toISOString()` | Generate ISO 8601 timestamps for `createdAt` / `updatedAt` | Standard JS — no fallback needed |
| `JSON.parse()` / `JSON.stringify()` | Serialize/deserialize task array for localStorage | Parse failure → `STORAGE_CORRUPT` → silent reset to `[]` |

### Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Google Chrome | Current stable | Primary development target |
| Mozilla Firefox | Current stable | Full parity expected |
| Apple Safari | Current stable | Test localStorage behavior specifically (stricter storage policies) |
| Microsoft Edge | Current stable | Chromium-based; Chrome parity expected |

Internet Explorer is not supported. No IE polyfills are included.

### Future Integration Extension Points (Post-v1)

These are explicitly out of scope for v1 but are documented here because the v1 architecture was designed to accommodate them without structural rework.

| Integration | Trigger Condition | Migration Path |
|-------------|-------------------|----------------|
| **Backend REST API** | Multi-device sync / data backup | Replace `src/api/tasks.ts` functions with `fetch()` calls to `https://{host}/api`; the endpoint contract (Section 4) is already REST-shaped |
| **User Authentication** (Auth0, Firebase Auth, Supabase) | Multi-user accounts | Add auth wrapper layer; no changes to core task logic |
| **Cloud Storage Sync** (Firebase, Supabase, PocketBase) | Data backup / multi-device | On first launch with backend enabled: read localStorage → POST each task → clear localStorage |
| **Push Notifications** | Due-date tracking feature | Register service worker; integrate with Notification API |

### localStorage → Backend Migration Contract

If a backend is introduced post-v1, the migration procedure is:

1. On first load with backend enabled, read `tasktracker_tasks` from localStorage.
2. For each task: `POST /api/tasks` with `{ title, completed }` — or a bulk-import endpoint if one is added.
3. If the backend supports client-supplied IDs: preserve original `id` and `createdAt` to maintain task history continuity.
4. On confirmation that all tasks are synced, delete the `tasktracker_tasks` localStorage key.
5. All subsequent reads/writes go through the backend API exclusively.

The v1 data schema (Section 3) intentionally uses the same field names and types as the future SQL DDL to make this migration lossless.

---

*TechArch generated: 2026-05-11 | Project: TaskTracker | Version: 1.0*
