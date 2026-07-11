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
