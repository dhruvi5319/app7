import { describe, it, expect, beforeEach } from 'vitest'
import { readTasks, writeTasks, StorageReadError } from './localStorage'
import type { Task } from '../types/task'

const STORAGE_KEY = 'tasktracker_tasks'

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'test-id-1',
    title: 'Test Task',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('readTasks()', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns [] when localStorage has no tasktracker_tasks key', () => {
    const result = readTasks()
    expect(result).toEqual([])
  })

  it('returns parsed Task[] when valid JSON exists', () => {
    const tasks: Task[] = [makeTask(), makeTask({ id: 'test-id-2', title: 'Second Task' })]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    const result = readTasks()
    expect(result).toEqual(tasks)
  })

  it('throws StorageReadError with code STORAGE_CORRUPT when JSON is invalid', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{{')
    expect(() => readTasks()).toThrow(StorageReadError)
    try {
      readTasks()
    } catch (err) {
      expect(err).toBeInstanceOf(StorageReadError)
      expect((err as StorageReadError).code).toBe('STORAGE_CORRUPT')
    }
  })
})

describe('writeTasks()', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('serializes tasks to JSON and sets tasktracker_tasks in localStorage', () => {
    const tasks: Task[] = [makeTask()]
    writeTasks(tasks)
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored).toBe(JSON.stringify(tasks))
  })

  it('after writeTasks, readTasks returns the same tasks', () => {
    const tasks: Task[] = [makeTask(), makeTask({ id: 'test-id-2', title: 'Another Task' })]
    writeTasks(tasks)
    const result = readTasks()
    expect(result).toEqual(tasks)
  })
})
