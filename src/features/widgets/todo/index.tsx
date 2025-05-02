import { useState } from 'react'
import { CheckSquare, Plus, Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import WidgetLayout from '@/features/widgets/components/widget-layout'
import type { WidgetProps } from '@/types/types'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoWidget({ widgetID, onDragStart }: WidgetProps) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Learn about tiling window managers', completed: false },
    { id: '2', text: 'Build a custom dashboard', completed: true },
  ])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim() === '') return

    setTodos([
      ...todos,
      { id: Date.now().toString(), text: newTodo, completed: false },
    ])
    setNewTodo('')
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <WidgetLayout
      title="Todo"
      icon={<CheckSquare className="w-4 h-4" />}
      onDragStart={onDragStart}
      widgetID={widgetID}
    >
      <div className="h-full flex flex-col">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a new task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
          />
          <Button size="icon" onClick={addTodo}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.text}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WidgetLayout>
  )
}
