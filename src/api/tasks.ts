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
