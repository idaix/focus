import { CheckSquareIcon, ClockIcon } from 'lucide-react'
import ClockWidget from './clock'
import TodoWidget from './todo'

export const WidgetRegistry: Record<
  string,
  {
    title: string
    icon: React.ReactNode
    Body: React.ComponentType<{ widgetID: string }>
  }
> = {
  clock: {
    title: 'Clock',
    icon: <ClockIcon className="w-4 h-4" />,
    Body: ClockWidget,
  },
  todo: {
    title: 'Todo List',
    icon: <CheckSquareIcon className="w-4 h-4" />,
    Body: TodoWidget,
  },
}
