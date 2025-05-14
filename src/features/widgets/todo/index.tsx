import TodoForm from './components/todo-form'
import TodoCard from './components/todo-card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { db } from './db'
import { useLiveQuery } from 'dexie-react-hooks'
export default function TodoWidget() {
  const todos = useLiveQuery(() => db.todos.orderBy('createdAt').toArray(), [])
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
              {todos.map((todo, i) => {
                const current = format(todo.createdAt, 'MM/dd/yyyy')
                const prev =
                  i < todos.length - 1
                    ? format(todos[i + 1].createdAt, 'MM/dd/yyyy')
                    : null
                const showDateHeader = current !== prev
                return (
                  <div key={todo.id}>
                    {showDateHeader && (
                      <div className="text-xs italic text-primary/20 flex items-center gap-1.5 mb-1">
                        <div className="flex-1 w-full border-b border-dotted border-primary/20" />
                        {current}
                        <div className="flex-1 w-full border-b border-dotted border-primary/20" />
                      </div>
                    )}
                    <TodoCard key={todo.id} todo={todo} />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
