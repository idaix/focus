import { CheckSquareIcon, Clock, PlusCircle, CloudIcon, TimerIcon, StickyNoteIcon, CalculatorIcon } from 'lucide-react'
import type { WidgetOption, WidgetType } from '@/types/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface WidgetSelectorProps {
  onSelect: (widgetType: WidgetType) => void
  asIcon?: boolean
}

const WidgetSelector = ({ onSelect, asIcon = false }: WidgetSelectorProps) => {
  const widgetOptions: Array<WidgetOption> = [
    {
      type: 'todo',
      name: 'Todo List',
      description: 'Keep track of your tasks',
      icon: <CheckSquareIcon className="h-4 w-4" />,
    },
    {
      type: 'clock',
      name: 'Clock',
      description: 'Display current time and date',
      icon: <Clock className="h-4 w-4" />,
    },
    {
      type: 'weather',
      name: 'Weather',
      description: 'Current weather and forecast',
      icon: <CloudIcon className="h-4 w-4" />,
    },
    {
      type: 'pomodoro',
      name: 'Pomodoro',
      description: 'Focus timer',
      icon: <TimerIcon className="h-4 w-4" />,
    },
    {
      type: 'notes',
      name: 'Notes',
      description: 'Quick sticky notes',
      icon: <StickyNoteIcon className="h-4 w-4" />,
    },
    {
      type: 'calculator',
      name: 'Calculator',
      description: 'Simple calculator',
      icon: <CalculatorIcon className="h-4 w-4" />,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          className="flex items-center gap-2 mx-auto cursor-crosshair"
        >
          <PlusCircle className="h-4 w-4" />
          {!asIcon && 'Add Widget'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        onSelect={(e) => console.log(e.target)}
        className="w-56"
      >
        {widgetOptions.map((option) => (
          <DropdownMenuItem
            onClick={() => onSelect(option.type)}
            className="cursor-copy"
            key={option.type}
          >
            {option.icon}
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default WidgetSelector
