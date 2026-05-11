import type { Task } from '../types/task'

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

export function readTasks(): Task[] { throw new Error('not implemented') }

export function writeTasks(_tasks: Task[]): void { throw new Error('not implemented') }
