import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

export default function ClockWidget() {
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
    <div className="h-full flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h2 className="text-lg font-medium">Clock</h2>
      </div>
      <div className="text-4xl font-bold mb-2">{formatTime(time)}</div>
      <div className="text-muted-foreground">{formatDate(time)}</div>
    </div>
  )
}
