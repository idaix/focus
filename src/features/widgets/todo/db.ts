import Dexie, { type EntityTable } from 'dexie'

export interface Todo {
  id: number
  text: string
  isCompleted: boolean
  createdAt: Date
  completedAt: Date | null
}
class TodosDB extends Dexie {
  todos!: EntityTable<Todo, 'id'>
  constructor() {
    super('TodoDB')
    this.version(1).stores({
      todos: '++id, text, isCompleted, createdAt, completedAt',
    })
  }
}

export const db = new TodosDB()
