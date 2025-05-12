import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import TodoForm from './components/todo-form'
import TodoCard from './components/todo-card'
import { ScrollArea } from '@/components/ui/scroll-area'
export default function TodoWidget() {
  const todos = useLiveQuery(() => db.todos.toArray())

  return (
    <div className="flex flex-col gap-3 h-full">
      <TodoForm />
      <div className="flex-1 overflow-hidden">
        {!todos || todos.length === 0 ? (
          <div className="grid place-items-center h-full text-muted-foreground">
            Add a To-do
          </div>
        ) : (
          <ScrollArea className="h-full">
            <div className="flex flex-col-reverse gap-1 pb-2 pr-2">
              {todos.map((todo) => (
                <TodoCard key={todo.id} todo={todo} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
