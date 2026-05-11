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
