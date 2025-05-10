import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import TodoForm from './components/todo-form'
import TodoCard from './components/todo-card'
export default function TodoWidget() {
  const todos = useLiveQuery(() => db.todos.toArray())

  return (
    <div className="grid grid-rows-[auto_1fr] h-full gap-3">
      <TodoForm />
      <div className="h-full overflow-auto">
        {todos?.length === 0 && (
          <div className="grid place-items-center h-full text-muted-foreground">
            Add a To-do
          </div>
        )}

        {todos && todos.length > 0 && (
          <div className="flex flex-col-reverse gap-1">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
