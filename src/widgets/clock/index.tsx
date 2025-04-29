import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import WidgetLayout from '@/components/layouts/widget-layout'
import type { WidgetProps } from '@/types/types'

export default function ClockWidget({ widgetID, onDragStart }: WidgetProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <WidgetLayout
      title="Clock"
      icon={<Clock className="w-4 h-4" />}
      onDragStart={onDragStart}
      widgetID={widgetID}
    >
      <div className="h-full flex flex-col items-center justify-center text-center">
        <div className="text-4xl font-bold mb-2">{formatTime(time)}</div>
        <div className="text-muted-foreground">{formatDate(time)}</div>
      </div>
    </WidgetLayout>
  )
}
