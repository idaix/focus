import Dexie, { type EntityTable } from 'dexie'

interface Todo {
  id: number
  text: string
  isCompleted: boolean
  createdAt: Date
  completedAt: Date | null
}

const db = new Dexie('TodosDatabase') as Dexie & {
  todos: EntityTable<Todo, 'id'>
}

db.version(1).stores({
  todos: '++id, text, createdAt',
})

export type { Todo }
export { db }
