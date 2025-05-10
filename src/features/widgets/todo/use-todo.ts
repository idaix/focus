import { db } from './db'

type ReturnResult = {
  error?: string
  id?: number
}
async function add(text: string): Promise<ReturnResult> {
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

async function remove(id: number): Promise<ReturnResult> {
  try {
    await db.todos.delete(id)
    return { id }
  } catch (error) {
    console.error('Error deleting todo:', error)
    return { error: 'Failed to delete todo' }
  }
}

export { add, remove }
