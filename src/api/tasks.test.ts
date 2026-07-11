import { describe, it, expect, beforeEach } from 'vitest'
import { getTasks, createTask, updateTask, deleteTask } from './tasks'

describe('getTasks()', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns [] when localStorage is empty', () => {
    const result = getTasks()
    expect(result).toEqual([])
  })

  it('returns [] when localStorage key does not exist', () => {
    localStorage.removeItem('tasktracker_tasks')
    const result = getTasks()
    expect(result).toEqual([])
  })

  it('returns deserialized tasks sorted by createdAt ASC', () => {
    // Insert out-of-order: newer first
    const task1 = createTask('First task')
    // Ensure task2 has a later timestamp
    const task2 = createTask('Second task')
    // Manually set task1 to older timestamp to test sorting
    localStorage.clear()
    const olderTask = { ...task1, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' }
    const newerTask = { ...task2, createdAt: '2024-01-02T00:00:00.000Z', updatedAt: '2024-01-02T00:00:00.000Z' }
    // Write in reverse order
    localStorage.setItem('tasktracker_tasks', JSON.stringify([newerTask, olderTask]))
    const result = getTasks()
    expect(result[0].createdAt).toBe('2024-01-01T00:00:00.000Z')
    expect(result[1].createdAt).toBe('2024-01-02T00:00:00.000Z')
  })
})

describe('createTask()', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("('Buy milk') → Task with id, title='Buy milk', completed=false, createdAt/updatedAt ISO strings", () => {
    const task = createTask('Buy milk')
    expect(task.id).toBeTruthy()
    expect(task.title).toBe('Buy milk')
    expect(task.completed).toBe(false)
    expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect(task.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
  })

  it("('  Buy milk  ') → title is trimmed to 'Buy milk'", () => {
    const task = createTask('  Buy milk  ')
    expect(task.title).toBe('Buy milk')
  })

  it("('') → throws error with code TITLE_REQUIRED", () => {
    expect(() => createTask('')).toThrow()
    try {
      createTask('')
    } catch (err) {
      expect((err as { code: string }).code).toBe('TITLE_REQUIRED')
    }
  })

  it("('   ') → throws error with code TITLE_REQUIRED (whitespace only)", () => {
    expect(() => createTask('   ')).toThrow()
    try {
      createTask('   ')
    } catch (err) {
      expect((err as { code: string }).code).toBe('TITLE_REQUIRED')
    }
  })

  it("('a'.repeat(500)) → creates task (max length OK)", () => {
    const longTitle = 'a'.repeat(500)
    const task = createTask(longTitle)
    expect(task.title).toBe(longTitle)
  })

  it("('a'.repeat(501)) → throws error with code TITLE_TOO_LONG", () => {
    expect(() => createTask('a'.repeat(501))).toThrow()
    try {
      createTask('a'.repeat(501))
    } catch (err) {
      expect((err as { code: string }).code).toBe('TITLE_TOO_LONG')
    }
  })

  it('persists to localStorage (getTasks after createTask returns the task)', () => {
    const task = createTask('Persisted task')
    const tasks = getTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toEqual(task)
  })
})

describe('updateTask()', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('(id, { completed: true }) → returns task with completed=true, updatedAt refreshed', async () => {
    const task = createTask('Test task')
    const originalUpdatedAt = task.updatedAt
    // Wait a tiny bit to ensure different timestamp
    await new Promise((resolve) => setTimeout(resolve, 10))
    const updated = updateTask(task.id, { completed: true })
    expect(updated.completed).toBe(true)
    expect(updated.updatedAt).not.toBe(originalUpdatedAt)
  })

  it("(id, { title: 'New title' }) → returns task with title='New title', updatedAt refreshed", async () => {
    const task = createTask('Original title')
    const originalUpdatedAt = task.updatedAt
    await new Promise((resolve) => setTimeout(resolve, 10))
    const updated = updateTask(task.id, { title: 'New title' })
    expect(updated.title).toBe('New title')
    expect(updated.updatedAt).not.toBe(originalUpdatedAt)
  })

  it("(id, { title: '  New  ' }) → title is trimmed to 'New'", () => {
    const task = createTask('Original')
    const updated = updateTask(task.id, { title: '  New  ' })
    expect(updated.title).toBe('New')
  })

  it("(id, { title: '' }) → throws TITLE_REQUIRED", () => {
    const task = createTask('Original')
    expect(() => updateTask(task.id, { title: '' })).toThrow()
    try {
      updateTask(task.id, { title: '' })
    } catch (err) {
      expect((err as { code: string }).code).toBe('TITLE_REQUIRED')
    }
  })

  it("('non-existent-id', {}) → throws TASK_NOT_FOUND", () => {
    expect(() => updateTask('non-existent-id', {})).toThrow()
    try {
      updateTask('non-existent-id', {})
    } catch (err) {
      expect((err as { code: string }).code).toBe('TASK_NOT_FOUND')
    }
  })

  it('persists changes to localStorage', () => {
    const task = createTask('Original')
    updateTask(task.id, { completed: true })
    const tasks = getTasks()
    expect(tasks[0].completed).toBe(true)
  })
})

describe('deleteTask()', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('(id) → task removed; getTasks() no longer includes it', () => {
    const task = createTask('To be deleted')
    deleteTask(task.id)
    const tasks = getTasks()
    expect(tasks).toHaveLength(0)
    expect(tasks.find((t) => t.id === task.id)).toBeUndefined()
  })

  it("('non-existent-id') → throws TASK_NOT_FOUND", () => {
    expect(() => deleteTask('non-existent-id')).toThrow()
    try {
      deleteTask('non-existent-id')
    } catch (err) {
      expect((err as { code: string }).code).toBe('TASK_NOT_FOUND')
    }
  })

  it('persists deletion to localStorage', () => {
    const task1 = createTask('Task 1')
    const task2 = createTask('Task 2')
    deleteTask(task1.id)
    const tasks = getTasks()
    expect(tasks).toHaveLength(1)
    expect(tasks[0].id).toBe(task2.id)
  })
})
