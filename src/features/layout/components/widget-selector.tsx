import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { WidgetOption, WidgetType } from '@/types/types'
import {
  CheckSquareIcon,
  Clock,
  Cloud,
  Music,
  PlusCircle,
  StickyNote,
} from 'lucide-react'

interface WidgetSelectorProps {
  onSelect: (widgetType: WidgetType) => void
  asIcon?: boolean
}

const WidgetSelector = ({ onSelect, asIcon = false }: WidgetSelectorProps) => {
  const widgetOptions: WidgetOption[] = [
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
      description: 'Check current weather conditions',
      icon: <Cloud className="h-4 w-4" />,
    },
    {
      type: 'music',
      name: 'Music Player',
      description: 'Control your music playback',
      icon: <Music className="h-4 w-4" />,
    },
    {
      type: 'notes',
      name: 'Notes',
      description: 'Quick notes and reminders',
      icon: <StickyNote className="h-4 w-4" />,
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
