import { db, type Todo } from './db'

export type ReturnResult = {
  error?: string
  id?: number
}

/**
 * Add a new todo item
 */
export async function addTodo(text: string): Promise<ReturnResult> {
  try {
    const id = await db.todos.add({
      text,
      isCompleted: false,
      createdAt: new Date(),
      completedAt: null,
    })
    return { id }
  } catch (error) {
    console.error('Error adding todo:', error)
    return { error: 'Failed to add todo' }
  }
}

/**
 * Remove a todo by id
 */
export async function removeTodo(id: number): Promise<ReturnResult> {
  try {
    await db.todos.delete(id)
    return { id }
  } catch (error) {
    console.error('Error deleting todo:', error)
    return { error: 'Failed to delete todo' }
  }
}

/**
 * Update a todo's text or completion status
 */
export async function updateTodo(
  id: number,
  updates: Partial<Pick<Todo, 'text' | 'isCompleted'>>,
): Promise<ReturnResult> {
  try {
    if (Object.keys(updates).length === 0) {
      return { error: 'No updates provided' }
    }
    await db.todos.update(id, updates)
    return { id }
  } catch (error) {
    console.error('Error updating todo:', error)
    return { error: 'Failed to update todo' }
  }
}

/**
 * Mark a todo as completed (sets isCompleted and completedAt)
 */
export async function completeTodo(id: number): Promise<ReturnResult> {
  try {
    await db.todos.update(id, {
      isCompleted: true,
      completedAt: new Date(),
    })
    return { id }
  } catch (error) {
    console.error('Error completing todo:', error)
    return { error: 'Failed to complete todo' }
  }
}

/**
 * Fetch a single todo by id
 */
export async function getTodo(id: number): Promise<Todo | undefined> {
  return db.todos.get(id)
}

/**
 * Fetch all todos, optionally filter by completion status
 */
export async function getAllTodos(
  filterStatus?: 'completed' | 'pending',
): Promise<Todo[]> {
  let collection = db.todos.orderBy('createdAt')

  if (filterStatus === 'completed') {
    collection = collection.filter((todo) => todo.isCompleted)
  } else if (filterStatus === 'pending') {
    collection = collection.filter((todo) => !todo.isCompleted)
  }

  return collection.toArray()
}
