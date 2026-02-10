import { CheckSquareIcon, ClockIcon, CloudIcon, TimerIcon, StickyNoteIcon, CalculatorIcon } from 'lucide-react'
import ClockWidget from './clock'
import TodoWidget from './todo'
import WeatherWidget from './weather'
import PomodoroWidget from './pomodoro'
import NotesWidget from './notes'
import CalculatorWidget from './calculator'

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
  weather: {
    title: 'Weather',
    icon: <CloudIcon className="w-4 h-4" />,
    Body: WeatherWidget,
  },
  pomodoro: {
    title: 'Pomodoro',
    icon: <TimerIcon className="w-4 h-4" />,
    Body: PomodoroWidget,
  },
  notes: {
    title: 'Notes',
    icon: <StickyNoteIcon className="w-4 h-4" />,
    Body: NotesWidget,
  },
  calculator: {
    title: 'Calculator',
    icon: <CalculatorIcon className="w-4 h-4" />,
    Body: CalculatorWidget,
  },
}
