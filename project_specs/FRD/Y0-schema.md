---

## Y0: Database / Storage Schema

**Storage mechanism:** Browser `localStorage` (v1). All task data is stored as a JSON-serialized array under a single localStorage key. If a server-side backend is added in a future version, this schema maps directly to a SQL or NoSQL table/collection.

---

### localStorage Key

| Key | Value Type | Description |
|-----|-----------|-------------|
| `tasktracker_tasks` | JSON string (array of Task objects) | The complete ordered list of all tasks |

**Example raw localStorage value:**
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

---

### Task Object Schema

#### TypeScript Interface

```typescript
interface Task {
  id: string;          // UUID v4 — unique identifier, generated at creation
  title: string;       // Non-empty string, max 500 chars, trimmed
  completed: boolean;  // false = incomplete, true = complete
  createdAt: string;   // ISO 8601 datetime string (e.g. "2026-05-11T09:00:00.000Z")
  updatedAt: string;   // ISO 8601 datetime string — updated on every mutation
}
```

#### Field Specifications

| Field | Type | Required | Constraints | Set By | Mutated By |
|-------|------|----------|-------------|--------|------------|
| `id` | `string` (UUID v4) | Yes | Unique, immutable after creation, never null | System (F00) | Never |
| `title` | `string` | Yes | Non-empty after trim; max 500 chars | User (F00) | User (F04) |
| `completed` | `boolean` | Yes | `true` or `false` only; default `false` | System (F00) | User (F02) |
| `createdAt` | `string` (ISO 8601) | Yes | Set at creation; immutable | System (F00) | Never |
| `updatedAt` | `string` (ISO 8601) | Yes | Set at creation; refreshed on every mutation | System (F00) | System (F02, F04) |

---

### Relational DDL (Future Backend Reference)

If a SQL backend is introduced post-v1, the equivalent schema is:

```sql
-- tasks table
CREATE TABLE tasks (
    id          VARCHAR(36)   PRIMARY KEY,           -- UUID v4
    title       VARCHAR(500)  NOT NULL,              -- Task title, trimmed, non-empty
    completed   BOOLEAN       NOT NULL DEFAULT FALSE, -- Completion status
    created_at  TIMESTAMP     NOT NULL,              -- Creation time (UTC)
    updated_at  TIMESTAMP     NOT NULL               -- Last modification time (UTC)
);

-- Index for default sort order
CREATE INDEX idx_tasks_created_at ON tasks (created_at ASC);
```

---

### Data Integrity Rules

- The stored array must always be a valid JSON array. An empty task list is stored as `[]`, not `null` or an absent key.
- Task `id` values within the array must be unique. If a duplicate is detected on read, the first occurrence is retained and subsequent duplicates are discarded.
- The array is written in full on every mutation (read → modify → write). Partial writes are not supported in localStorage.
- On read failure (parse error, SecurityError), the app initializes with an empty array and optionally surfaces a warning (see F01 Error States).

---

### Storage Size Considerations

- localStorage is limited to approximately 5–10 MB per origin (browser-dependent).
- Each task object is approximately 200–300 bytes serialized.
- Theoretical capacity: ~20,000–50,000 tasks before approaching storage limits.
- No automatic pruning is implemented in v1. Storage-full errors surface as `STORAGE_WRITE_FAILED` (see `Y2-errors.md`).
