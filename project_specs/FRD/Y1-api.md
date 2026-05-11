---

## Y1: API Endpoints

**Note on v1 Architecture:** TaskTracker v1 is a client-only application with no backend server. All "API" operations are implemented as JavaScript module functions operating on localStorage. The endpoints below represent the **logical interface contract** — they specify the exact inputs, outputs, and error behaviors that the client-side implementation must honour, and they are defined in REST form so that a backend can be introduced in a future version without changing the feature contracts.

**Base path (v1 client):** Functions exported from `src/api/tasks.js` (or equivalent).
**Base path (future server):** `https://{host}/api`

---

### Authentication

None. v1 is single-user with no authentication.

---

### Common Response Format

**Success:**
```json
{
  "data": { ... }
}
```

**Error:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message."
  }
}
```

---

### §Task List — GET /api/tasks

Retrieve all tasks, sorted by `createdAt` ascending.

**Request:**
- Method: `GET`
- Path: `/api/tasks`
- Body: None
- Query params: None (filtering/sorting deferred to post-v1)

**Response — 200 OK:**
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
- Returns an empty array `[]` when no tasks exist (not a 404).

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 500 | `STORAGE_READ_FAILED` | localStorage read throws an exception |

---

### §Task Creation — POST /api/tasks

Create a new task.

**Request:**
- Method: `POST`
- Path: `/api/tasks`
- Content-Type: `application/json`
- Body:
```json
{
  "title": "Buy groceries"
}
```

**Field Constraints:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes | Non-empty after trim; max 500 chars |

**Response — 201 Created:**
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

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 422 | `TITLE_REQUIRED` | `title` is absent, empty, or whitespace-only after trim |
| 422 | `TITLE_TOO_LONG` | `title` exceeds 500 characters after trim |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails (storage full, SecurityError) |

---

### §Task Completion — PATCH /api/tasks/:id (toggle completed)

Toggle the completion status of a task.

**Request:**
- Method: `PATCH`
- Path: `/api/tasks/:id`
- Content-Type: `application/json`
- Body:
```json
{
  "completed": true
}
```

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Body Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `completed` | boolean | Yes | `true` or `false` |

**Response — 200 OK:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries",
    "completed": true,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T14:00:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists |
| 422 | `INVALID_FIELD` | `completed` is not a boolean |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails |

---

### §Task Editing — PATCH /api/tasks/:id (update title)

Update the title of an existing task. Uses the same endpoint as §Task Completion — the body determines which fields are updated.

**Request:**
- Method: `PATCH`
- Path: `/api/tasks/:id`
- Content-Type: `application/json`
- Body:
```json
{
  "title": "Buy groceries and cook dinner"
}
```

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Body Fields:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | Yes (for edit) | Non-empty after trim; max 500 chars |

**Response — 200 OK:**
```json
{
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "title": "Buy groceries and cook dinner",
    "completed": false,
    "createdAt": "2026-05-11T09:00:00.000Z",
    "updatedAt": "2026-05-11T15:30:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists |
| 422 | `TITLE_REQUIRED` | `title` is present in body but empty or whitespace-only after trim |
| 422 | `TITLE_TOO_LONG` | `title` exceeds 500 characters after trim |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails |

---

### §Task Deletion — DELETE /api/tasks/:id

Permanently delete a task.

**Request:**
- Method: `DELETE`
- Path: `/api/tasks/:id`
- Body: None

**Path Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string (UUID v4) | Yes | The task's unique identifier |

**Response — 204 No Content:**
- Body: Empty

**Error Responses:**

| HTTP Status | Error Code | Condition |
|-------------|------------|-----------|
| 404 | `TASK_NOT_FOUND` | No task with the given `id` exists (optional — see note) |
| 500 | `STORAGE_WRITE_FAILED` | localStorage write fails |

> **Note on 404 for DELETE:** If the task is already absent (stale ID), the v1 client treats this as a silent success (idempotent delete). A future server-side implementation may return 404 strictly.

---

### PATCH Endpoint Behavior — Partial Update Rules

The `PATCH /api/tasks/:id` endpoint accepts partial updates. Only fields present in the request body are modified. Fields absent from the body are left unchanged.

| Body contains | Effect |
|--------------|--------|
| `{ "completed": true }` | Updates `completed` only + refreshes `updatedAt` |
| `{ "title": "New title" }` | Updates `title` only + refreshes `updatedAt` |
| `{ "title": "New title", "completed": true }` | Updates both fields + refreshes `updatedAt` |
| `{}` (empty body) | No-op; returns 200 with unchanged task |

Fields `id`, `createdAt` are immutable and are ignored if included in a PATCH body.
