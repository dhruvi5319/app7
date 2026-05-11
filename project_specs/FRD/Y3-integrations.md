---

## Y3: Integration Points

**Summary:** TaskTracker v1 has no external service integrations. The application is entirely self-contained in the browser, relying solely on browser-native APIs. This section documents the browser API dependencies and establishes the integration contract for any future external integrations.

---

### v1 Browser API Dependencies

| API | Usage | Fallback / Error Handling |
|-----|-------|--------------------------|
| `window.localStorage` | Primary persistence store — read/write all task data as JSON under key `tasktracker_tasks` | On `SecurityError` (private browsing blocked): surface `STORAGE_READ_FAILED` banner; disable write operations. On `QuotaExceededError`: surface `STORAGE_WRITE_FAILED` toast. |
| `crypto.randomUUID()` | Generate UUID v4 for task `id` at creation time | If unavailable (very old browser): fall back to a polyfill UUID v4 implementation |
| `Date.prototype.toISOString()` | Generate ISO 8601 timestamps for `createdAt` and `updatedAt` | Standard JS — no fallback needed; universally available |
| `JSON.parse()` / `JSON.stringify()` | Serialize and deserialize the tasks array for localStorage storage | On parse failure: catch error, treat as `STORAGE_CORRUPT` (see `Y2-errors.md`), reset to empty array |

---

### Browser Compatibility Contract

TaskTracker v1 must function correctly in the following browsers (current stable versions):

| Browser | Minimum Supported Version | Notes |
|---------|--------------------------|-------|
| Google Chrome | Current stable | Primary development target |
| Mozilla Firefox | Current stable | Full parity expected |
| Apple Safari | Current stable | Test localStorage behavior specifically (Safari has historically had stricter storage policies) |
| Microsoft Edge | Current stable | Chromium-based; Chrome parity expected |

**Not supported:** Internet Explorer (any version). No polyfills for IE are required.

---

### Future Integration Candidates (Post-v1, Out of Scope)

The following integrations are **explicitly out of scope for v1** but are documented here as known future extension points:

| Integration | Trigger | Notes |
|-------------|---------|-------|
| Backend REST API | If multi-device sync is added | The logical API contract in `Y1-api.md` is pre-designed for this migration |
| User Authentication (e.g., Auth0, Firebase Auth) | If multi-user accounts are added | No auth scaffolding in v1; add as a wrapper layer |
| Push Notifications / Reminders | If due-date tracking is added | Not in v1 scope |
| Cloud Storage Sync (e.g., Firebase Realtime DB) | If data backup is added | localStorage → API migration path exists via `Y1-api.md` contract |

---

### Data Migration Contract (localStorage → Future Backend)

If a backend is introduced post-v1, the localStorage data can be migrated as follows:
1. On first load with a backend enabled, read `tasktracker_tasks` from localStorage.
2. `POST /api/tasks` for each task in the local array (preserving `createdAt` and `id` if the backend supports client-supplied IDs).
3. On successful sync confirmation, clear the localStorage key.
4. Future reads/writes go exclusively through the backend API.

This migration path is documented here to ensure the v1 data schema (see `Y0-schema.md`) does not introduce breaking changes to a future backend schema.
