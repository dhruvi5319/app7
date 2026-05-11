import type { Task, UpdateTaskRequest } from '../types/task'

export function getTasks(): Task[] { throw new Error('not implemented') }

export function createTask(_title: string): Task { throw new Error('not implemented') }

export function updateTask(_id: string, _patch: UpdateTaskRequest): Task { throw new Error('not implemented') }

export function deleteTask(_id: string): void { throw new Error('not implemented') }
