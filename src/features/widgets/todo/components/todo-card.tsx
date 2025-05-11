import { Card } from '@/components/ui/card'
import type { Todo } from '../db'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CheckIcon, Clock, Edit2Icon, EditIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { remove } from '../use-todo'
interface Props {
  todo: Todo
}

const TodoCard = ({ todo }: Props) => {
  return (
    <Card className="group px-3 py-2 bg-accent/10 backdrop-blur-md grid gap-1 overflow-hidden">
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3 " />
        <span className="text-xs text-muted-foreground">
          created: {format(todo.createdAt, 'MM/dd/yyyy')}
        </span>
        {todo.isCompleted && (
          <>
            <span className="text-xs text-muted-foreground">-</span>
            <span className="text-xs text-muted-foreground">
              completed: {format(todo.createdAt, 'MM/dd/yyyy')}
            </span>
          </>
        )}
      </div>
      <p
        className={cn(
          todo.isCompleted && 'text-muted-foreground line-through',
          '',
        )}
      >
        {todo.text}
      </p>
      <div className="absolute group-hover:right-0 w-0 -right-1/2 group-hover:w-1/2 opacity-0 group-hover:opacity-100 transition-all h-full bg-gradient-to-l from-primary-foreground/50 to-transparent flex items-center justify-end p-2 gap-1.5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => remove(todo.id)}
          className=""
        >
          <CheckIcon className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => remove(todo.id)}
          className=""
        >
          <Edit2Icon className="w-3 h-3" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => remove(todo.id)}
          className=""
        >
          <TrashIcon className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  )
}

export default TodoCard
