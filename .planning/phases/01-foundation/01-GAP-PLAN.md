---
phase: 01-foundation
plan: GAP
type: tdd
wave: 1
depends_on: []
files_modified:
  - src/types/task.ts
  - src/lib/uuid.ts
  - src/storage/localStorage.ts
  - src/storage/localStorage.test.ts
  - src/api/tasks.ts
  - src/api/tasks.test.ts
autonomous: true
gap_closure: true

features:
  implements: ["INFRA-DATA-LAYER"]
  depends_on: ["INFRA-SCAFFOLD"]
  enables: ["TASK-01", "TASK-02", "TASK-03", "TASK-04", "TASK-05"]

must_haves:
  truths:
    - "src/types/task.ts exists and exports Task, CreateTaskRequest, UpdateTaskRequest, ApiSuccessResponse, ApiErrorResponse, ErrorCode"
    - "src/api/tasks.ts exists and exports getTasks, createTask, updateTask, deleteTask"
    - "npm test exits 0 with all unit tests passing for the data layer"
    - "`getTasks()` returns tasks sorted by createdAt ASC, deserialized from localStorage"
    - "`createTask(title)` validates title, generates UUID + ISO timestamps, appends to store, returns new Task"
    - "`updateTask(id, patch)` applies partial update, refreshes updatedAt, persists; throws TASK_NOT_FOUND if id missing"
    - "`deleteTask(id)` removes the task by id and persists the remaining array; throws TASK_NOT_FOUND if id missing"
  artifacts:
    - path: "src/types/task.ts"
      provides: "Task interface and related types"
      exports: ["Task", "CreateTaskRequest", "UpdateTaskRequest", "ApiSuccessResponse", "ApiErrorResponse", "ErrorCode"]
    - path: "src/lib/uuid.ts"
      provides: "UUID v4 generator"
      exports: ["generateUUID"]
    - path: "src/storage/localStorage.ts"
      provides: "localStorage adapter with typed errors"
      exports: ["readTasks", "writeTasks", "StorageReadError", "StorageWriteError"]
    - path: "src/storage/localStorage.test.ts"
      provides: "Unit tests for storage adapter"
    - path: "src/api/tasks.ts"
      provides: "Client API module"
      exports: ["getTasks", "createTask", "updateTask", "deleteTask"]
    - path: "src/api/tasks.test.ts"
      provides: "Unit tests for all API functions (RED → GREEN verified)"
  key_links:
    - from: "src/api/tasks.ts"
      to: "src/storage/localStorage.ts"
      via: "readTasks / writeTasks imports"
      pattern: "import.*from.*storage/localStorage"
    - from: "src/api/tasks.ts"
      to: "src/lib/uuid.ts"
      via: "generateUUID import"
      pattern: "import.*from.*lib/uuid"
    - from: "src/api/tasks.ts"
      to: "src/types/task.ts"
      via: "Task type imports"
      pattern: "import.*Task.*from.*types/task"
    - from: "src/storage/localStorage.ts"
      to: "window.localStorage"
      via: "getItem / setItem with key 'tasktracker_tasks'"
      pattern: "tasktracker_tasks"

# Integration contracts — cross-wave artifact handoffs
integration_contracts:
  requires: []
  provides:
    - artifact: "src/types/task.ts"
      exports: ["Task", "CreateTaskRequest", "UpdateTaskRequest", "ApiSuccessResponse", "ApiErrorResponse", "ErrorCode"]
      shape: |
        export interface Task { id: string; title: string; completed: boolean; createdAt: string; updatedAt: string }
        export type ErrorCode = 'TITLE_REQUIRED' | 'TITLE_TOO_LONG' | 'TASK_NOT_FOUND' | 'STORAGE_READ_FAILED' | 'STORAGE_WRITE_FAILED' | 'STORAGE_CORRUPT' | 'INVALID_FIELD'
      verify: "grep -n 'export interface Task' src/types/task.ts && grep -n 'export type ErrorCode' src/types/task.ts && echo CONTRACT_OK"
    - artifact: "src/api/tasks.ts"
      exports: ["getTasks", "createTask", "updateTask", "deleteTask"]
      shape: |
        export function getTasks(): Task[]
        export function createTask(title: string): Task
        export function updateTask(id: string, patch: UpdateTaskRequest): Task
        export function deleteTask(id: string): void
      verify: "grep -n 'export function getTasks\\|export function createTask\\|export function updateTask\\|export function deleteTask' src/api/tasks.ts | wc -l | grep -q '^4$' && echo CONTRACT_OK"
    - artifact: "src/storage/localStorage.ts"
      exports: ["readTasks", "writeTasks", "StorageReadError", "StorageWriteError"]
      shape: |
        export function readTasks(): Task[]
        export function writeTasks(tasks: Task[]): void
        export class StorageReadError extends Error { code: 'STORAGE_READ_FAILED' | 'STORAGE_CORRUPT' }
        export class StorageWriteError extends Error { code: 'STORAGE_WRITE_FAILED' }
      verify: "grep -n 'export function readTasks\\|export function writeTasks\\|export class StorageReadError\\|export class StorageWriteError' src/storage/localStorage.ts && echo CONTRACT_OK"
    - artifact: "src/lib/uuid.ts"
      exports: ["generateUUID"]
      shape: "export function generateUUID(): string"
      verify: "grep -n 'export function generateUUID' src/lib/uuid.ts && echo CONTRACT_OK"
---

<objective>
Execute Plan 01-02 (the data layer TDD plan) in full to close 3 UAT gaps that failed because this plan was never run.

Purpose: The project scaffold (Plan 01-01) was completed, but Plan 01-02 was skipped entirely, leaving `src/types/task.ts`, `src/lib/uuid.ts`, `src/storage/localStorage.ts`, and `src/api/tasks.ts` absent. UAT tests 4, 5, and 6 all fail for the same root cause: Plan 01-02 was never executed.

Output: All six data layer files created and passing `npm test` with 0 failures.
</objective>

<feature_dependencies>
Implements: INFRA-DATA-LAYER: localStorage adapter, Task schema, client API module (getTasks, createTask, updateTask, deleteTask), UUID utility
Depends on: INFRA-SCAFFOLD: Project scaffold with Vitest configured (plan 01-01, already complete)
Enables: TASK-01: Create task, TASK-02: View tasks, TASK-03: Mark complete, TASK-04: Delete task, TASK-05: Edit task title
</feature_dependencies>

<execution_context>
@/root/.config/opencode/pivota_spec-framework/workflows/execute-plan.md
@/root/.config/opencode/pivota_spec-framework/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-02-PLAN.md
</context>

## Gap Diagnosis

All 3 UAT failures (tests 4, 5, 6) share a single root cause: **Plan 01-02 was never executed.** No new plan is needed — the existing plan at `01-02-PLAN.md` is complete and covers all gaps. This gap closure plan's sole instruction is: **implement Plan 01-02 exactly as written.**

| UAT Test | Truth That Failed | Root Cause |
|----------|-------------------|------------|
| Test 4 | `src/types/task.ts` exists with required exports | File never created |
| Test 5 | `src/api/tasks.ts` exists with 4 exported functions | File (and `src/api/` dir) never created |
| Test 6 | `npm test` exits 0 with all data layer tests passing | No test files exist |

<tasks>

<task type="auto">
  <name>Execute Plan 01-02: Full TDD data layer implementation</name>
  <files>
    src/types/task.ts
    src/lib/uuid.ts
    src/storage/localStorage.ts
    src/storage/localStorage.test.ts
    src/api/tasks.ts
    src/api/tasks.test.ts
  </files>
  <action>
Implement the complete data layer exactly as specified in `.planning/phases/01-foundation/01-02-PLAN.md`. Follow the three-phase TDD cycle below without deviation.

---

### RED Phase — Write failing tests first

**1. Create `src/types/task.ts`** (interfaces only — nothing to test here):

```typescript
export interface Task {
  id: string;         // UUID v4 — unique identifier, immutable after creation
  title: string;      // Non-empty string, max 500 chars, trimmed
  completed: boolean; // false = incomplete, true = complete
  createdAt: string;  // ISO 8601 datetime string (UTC)
  updatedAt: string;  // ISO 8601 datetime string (UTC), refreshed on every mutation
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
  };
}

export type ErrorCode =
  | 'TITLE_REQUIRED'
  | 'TITLE_TOO_LONG'
  | 'TASK_NOT_FOUND'
  | 'STORAGE_READ_FAILED'
  | 'STORAGE_WRITE_FAILED'
  | 'STORAGE_CORRUPT'
  | 'INVALID_FIELD';
```

**2. Create `src/lib/uuid.ts` stub:**
```typescript
export function generateUUID(): string { throw new Error('not implemented') }
```

**3. Create `src/storage/localStorage.ts` stub** — all exports throw `not implemented`.

**4. Create `src/api/tasks.ts` stub** — all 4 functions throw `not implemented`.

**5. Write `src/storage/localStorage.test.ts`** with these test cases:
```
readTasks():
  - returns [] when localStorage has no 'tasktracker_tasks' key
  - returns parsed Task[] when valid JSON exists
  - throws StorageReadError with code STORAGE_CORRUPT when JSON is invalid

writeTasks():
  - serializes tasks to JSON and sets 'tasktracker_tasks' in localStorage
  - after writeTasks, readTasks returns the same tasks
```

**6. Write `src/api/tasks.test.ts`** with these test cases:
```
getTasks():
  - returns [] when localStorage is empty
  - returns deserialized tasks sorted by createdAt ASC (insert out-of-order, verify sort)
  - returns [] when localStorage key doesn't exist

createTask():
  - ('Buy milk') → Task with id, title='Buy milk', completed=false, createdAt/updatedAt ISO strings
  - ('  Buy milk  ') → title is trimmed to 'Buy milk'
  - ('') → throws error with code TITLE_REQUIRED
  - ('   ') → throws error with code TITLE_REQUIRED (whitespace only)
  - ('a'.repeat(500)) → creates task (max length OK)
  - ('a'.repeat(501)) → throws error with code TITLE_TOO_LONG
  - persists to localStorage (getTasks after createTask returns the task)

updateTask():
  - (id, { completed: true }) → returns task with completed=true, updatedAt refreshed
  - (id, { title: 'New title' }) → returns task with title='New title', updatedAt refreshed
  - (id, { title: '  New  ' }) → title is trimmed to 'New'
  - (id, { title: '' }) → throws TITLE_REQUIRED
  - ('non-existent-id', {}) → throws TASK_NOT_FOUND
  - persists changes to localStorage

deleteTask():
  - (id) → task removed; getTasks() no longer includes it
  - ('non-existent-id') → throws TASK_NOT_FOUND
  - persists deletion to localStorage
```

**7. Run `npm test`** — MUST show failures (RED confirmed). Commit:
```
test(01-02): add failing tests for data layer
```

---

### GREEN Phase — Implement until all tests pass

Implement in dependency order:

**`src/lib/uuid.ts`:**
```typescript
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Polyfill fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
```

**`src/storage/localStorage.ts`:**
```typescript
import type { Task } from '../types/task'

const STORAGE_KEY = 'tasktracker_tasks'

export class StorageReadError extends Error {
  code: 'STORAGE_READ_FAILED' | 'STORAGE_CORRUPT'
  constructor(code: 'STORAGE_READ_FAILED' | 'STORAGE_CORRUPT', message: string) {
    super(message)
    this.name = 'StorageReadError'
    this.code = code
  }
}

export class StorageWriteError extends Error {
  code: 'STORAGE_WRITE_FAILED'
  constructor(message: string) {
    super(message)
    this.name = 'StorageWriteError'
    this.code = 'STORAGE_WRITE_FAILED'
  }
}

export function readTasks(): Task[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return []
    return JSON.parse(raw) as Task[]
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new StorageReadError('STORAGE_CORRUPT', 'localStorage data is not valid JSON')
    }
    throw new StorageReadError('STORAGE_READ_FAILED', 'Failed to read from localStorage')
  }
}

export function writeTasks(tasks: Task[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    throw new StorageWriteError('Failed to write to localStorage')
  }
}
```

**`src/api/tasks.ts`:**
```typescript
import type { Task, UpdateTaskRequest } from '../types/task'
import { readTasks, writeTasks } from '../storage/localStorage'
import { generateUUID } from '../lib/uuid'

class ApiError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

function validateTitle(title: string): string {
  const trimmed = title.trim()
  if (trimmed.length === 0) {
    throw new ApiError('TITLE_REQUIRED', 'Title is required')
  }
  if (trimmed.length > 500) {
    throw new ApiError('TITLE_TOO_LONG', 'Title must be 500 characters or fewer')
  }
  return trimmed
}

export function getTasks(): Task[] {
  const tasks = readTasks()
  return [...tasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )
}

export function createTask(title: string): Task {
  const trimmedTitle = validateTitle(title)
  const now = new Date().toISOString()
  const newTask: Task = {
    id: generateUUID(),
    title: trimmedTitle,
    completed: false,
    createdAt: now,
    updatedAt: now,
  }
  const tasks = readTasks()
  writeTasks([...tasks, newTask])
  return newTask
}

export function updateTask(id: string, patch: UpdateTaskRequest): Task {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    throw new ApiError('TASK_NOT_FOUND', `Task with id "${id}" not found`)
  }
  const existing = tasks[index]
  const updatedTitle =
    patch.title !== undefined ? validateTitle(patch.title) : existing.title
  const updated: Task = {
    ...existing,
    title: updatedTitle,
    completed: patch.completed !== undefined ? patch.completed : existing.completed,
    updatedAt: new Date().toISOString(),
  }
  const updatedTasks = [...tasks]
  updatedTasks[index] = updated
  writeTasks(updatedTasks)
  return updated
}

export function deleteTask(id: string): void {
  const tasks = readTasks()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) {
    throw new ApiError('TASK_NOT_FOUND', `Task with id "${id}" not found`)
  }
  writeTasks(tasks.filter((t) => t.id !== id))
}
```

**Run `npm test`** — MUST show all passing (GREEN confirmed). Commit:
```
feat(01-02): implement data layer
```

---

### REFACTOR Phase (if needed)

Review for duplication in error handling or edge cases revealed by test failures. Run `npm test` after any changes — MUST still pass. Commit only if changes were made:
```
refactor(01-02): clean up data layer
```
  </action>
  <verify>
```bash
# All unit tests pass
npm test 2>&1 | tail -20 && echo "ALL TESTS PASS"

# TypeScript compiles cleanly
npx tsc --noEmit 2>&1 && echo "TSC CLEAN"

# Required exports exist in task types
grep -n "export interface Task\|export interface CreateTaskRequest\|export interface UpdateTaskRequest\|export type ErrorCode" src/types/task.ts

# Required exports exist in API module
grep -n "export function getTasks\|export function createTask\|export function updateTask\|export function deleteTask" src/api/tasks.ts

# localStorage key is correct
grep -n "tasktracker_tasks" src/storage/localStorage.ts

# Build still passes
npm run build 2>&1 | tail -5 && echo "BUILD OK"
```
  </verify>
  <done>
1. `npm test` exits 0 — all data layer test cases pass (0 failing, 0 skipped)
2. `src/types/task.ts` exports: Task, CreateTaskRequest, UpdateTaskRequest, ApiSuccessResponse, ApiErrorResponse, ErrorCode
3. `src/api/tasks.ts` exports: getTasks, createTask, updateTask, deleteTask
4. `src/storage/localStorage.ts` uses storage key `"tasktracker_tasks"`
5. `npx tsc --noEmit` exits 0 with no TypeScript errors
6. `npm run build` exits 0 — existing scaffold + new data layer compile together cleanly
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| app→localStorage | Serialized task data crossing from in-memory JS objects into browser localStorage and back |
| caller→api | Untrusted string input (task title) crossing into the data layer API functions |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-GAP-01 | Tampering | `src/api/tasks.ts::validateTitle` | mitigate | Title trimmed and length-checked in `validateTitle()` before any persistence; empty/overlong titles rejected with typed ErrorCode before reaching `writeTasks` |
| T-01-GAP-02 | Information disclosure | `src/storage/localStorage.ts::readTasks` | accept | localStorage is same-origin by default; all task data is already user-visible on screen. Residual risk accepted — no cross-origin data exposure in a pure client-side app |
| T-01-GAP-03 | Tampering | `src/storage/localStorage.ts::readTasks` | mitigate | Corrupt JSON caught via `SyntaxError` in `readTasks()` and re-thrown as `StorageReadError` with code `STORAGE_CORRUPT`; callers cannot receive partial/malformed task arrays |
| T-01-GAP-04 | Denial of service | `src/storage/localStorage.ts::writeTasks` | mitigate | `localStorage.setItem` wrapped in try/catch in `writeTasks()`; quota-exceeded throws are caught and re-thrown as `StorageWriteError` with code `STORAGE_WRITE_FAILED` so callers can surface a meaningful error |
| T-01-GAP-05 | Elevation of privilege | `src/api/tasks.ts` (all functions) | accept | No authentication or authorization layer — this is a single-user client-side app with no server. All data is local to the browser user. No privilege escalation vector exists in this architecture. |
</threat_model>

<verification>
```bash
# Confirm all 6 files exist
ls src/types/task.ts src/lib/uuid.ts src/storage/localStorage.ts src/storage/localStorage.test.ts src/api/tasks.ts src/api/tasks.test.ts

# Full test suite passes
npm test 2>&1 | tail -20 && echo "ALL TESTS PASS"

# TypeScript clean
npx tsc --noEmit 2>&1 && echo "TSC CLEAN"

# Build clean
npm run build 2>&1 | tail -5 && echo "BUILD OK"
```
</verification>

<success_criteria>
All 3 UAT gaps are closed when:
1. `src/types/task.ts` exists and exports Task, CreateTaskRequest, UpdateTaskRequest, ApiSuccessResponse, ApiErrorResponse, ErrorCode (closes UAT test 4)
2. `src/api/tasks.ts` exists and exports getTasks, createTask, updateTask, deleteTask (closes UAT test 5)
3. `npm test` exits 0 with all data layer unit tests passing (closes UAT test 6)
4. `npm run build` exits 0 — no regressions in existing scaffold
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-02-SUMMARY.md` documenting:
- Test count and pass rate
- Any deviations from the plan (e.g., test helper setup, mock approaches for localStorage in jsdom)
- TypeScript strict mode issues encountered and how resolved
- Final file sizes
</output>
