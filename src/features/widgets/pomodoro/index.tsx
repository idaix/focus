import { useState, useEffect } from 'react'
import { PlayIcon, PauseIcon, RotateCcwIcon, SettingsIcon, BarChart3Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

export default function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)
  const [mode, setMode] = useState<'work' | 'break'>('work')
  const [view, setView] = useState<'timer' | 'settings' | 'stats'>('timer')
  const [taskName, setTaskName] = useState('')
  const [startTime, setStartTime] = useState<Date | null>(null)

  // Load settings
  const settings = useLiveQuery(async () => {
    const s = await db.pomodoroSettings.get('default')
    return s || { workDuration: 25, breakDuration: 5 }
  })

  // Load stats
  const stats = useLiveQuery(async () => {
    const sessions = await db.pomodoroSessions.orderBy('startTime').reverse().limit(50).toArray()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toLocaleDateString()
    }).reverse()

    const dailyData = last7Days.map(date => {
        const daySessions = sessions.filter(s => s.startTime.toLocaleDateString() === date)
        const totalDuration = daySessions.reduce((acc, s) => acc + s.duration, 0)
        return { date, minutes: Math.round(totalDuration / 60) }
    })
    return dailyData
  })

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
    }
  }, [])

  // Update timer when settings change
  useEffect(() => {
    if (settings && !isActive && !startTime) {
       setTimeLeft((mode === 'work' ? settings.workDuration : settings.breakDuration) * 60)
    }
  }, [settings, mode])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>

    if (isActive && timeLeft > 0) {
      if (!startTime) setStartTime(new Date())
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      handleComplete()
    }

    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const handleComplete = async () => {
    if (Notification.permission === 'granted') {
      new Notification("Focus Timer", {
        body: `${mode === 'work' ? 'Work' : 'Break'} session complete!`,
        icon: '/logo.svg' // assuming
      })
    }
   
    if (mode === 'work') {
        const duration = settings?.workDuration ? settings.workDuration * 60 : 25 * 60
        await db.pomodoroSessions.add({
            id: crypto.randomUUID(),
            startTime: startTime || new Date(),
            endTime: new Date(),
            duration: duration,
            taskName: taskName || 'Untitled Task'
        })
    }
    setStartTime(null)
    // Sound could be played here
  }

  const toggleTimer = () => {
      setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setStartTime(null)
    if (settings) {
      setTimeLeft((mode === 'work' ? settings.workDuration : settings.breakDuration) * 60)
    }
  }

  const saveSettings = async (work: number, breakTime: number) => {
    await db.pomodoroSettings.put({
      id: 'default',
      workDuration: work,
      breakDuration: breakTime,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (view === 'settings' && settings) {
    return (
      <div className="h-full flex flex-col p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">Settings</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setView('timer')}>
            <RotateCcwIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
             <label className="text-xs text-muted-foreground">Work Duration (min)</label>
             <Slider value={[settings.workDuration]} min={1} max={60} step={1} onValueChange={(val) => saveSettings(val[0], settings.breakDuration)} />
             <span className="text-xs">{settings.workDuration} min</span>
          </div>
          <div className="space-y-2">
             <label className="text-xs text-muted-foreground">Break Duration (min)</label>
             <Slider value={[settings.breakDuration]} min={1} max={30} step={1} onValueChange={(val) => saveSettings(settings.workDuration, val[0])} />
             <span className="text-xs">{settings.breakDuration} min</span>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'stats') {
      const maxMinutes = Math.max(...(stats?.map(s => s.minutes) || [0]), 60)

      return (
        <div className="h-full flex flex-col p-4 space-y-2">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-sm">Weekly Focus</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setView('timer')}>
                    <RotateCcwIcon className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 flex items-end gap-2 justify-between px-2">
                {stats?.map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <div 
                            className="w-full bg-primary rounded-t-sm hover:bg-primary/80 transition-all"
                            style={{ height: `${(day.minutes / maxMinutes) * 100}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                        ></div>
                        <span className="text-[10px] text-muted-foreground truncate w-full text-center">{day.date.split('/')[1]}</span>
                    </div>
                ))}
            </div>
            <div className="text-center text-xs text-muted-foreground border-t pt-2 border-white/10">
                Total: {stats?.reduce((acc, s) => acc + s.minutes, 0)} mins this week
            </div>
        </div>
      )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4 p-4 relative group">
      <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setView('stats')}>
            <BarChart3Icon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setView('settings')}>
            <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex space-x-2">
        <Button
          variant={mode === 'work' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => { setMode('work'); setIsActive(false); if(settings) setTimeLeft(settings.workDuration * 60) }}
        >
          Work
        </Button>
        <Button
          variant={mode === 'break' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 text-xs"
          onClick={() => { setMode('break'); setIsActive(false); if(settings) setTimeLeft(settings.breakDuration * 60) }}
        >
          Break
        </Button>
      </div>

      <div className="text-5xl font-bold font-mono tracking-widest tabular-nums">
        {formatTime(timeLeft)}
      </div>

      {mode === 'work' && !isActive && timeLeft === (settings?.workDuration || 25) * 60 && (
          <Input 
            placeholder="Focus Task..." 
            className="h-8 w-3/4 text-xs text-center border-b border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 placeholder:text-muted-foreground/50" 
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
      )}
       {mode === 'work' && (isActive || timeLeft !== (settings?.workDuration || 25) * 60) && (
           <div className="h-8 text-xs flex items-center text-muted-foreground font-medium">
               {taskName || 'Focus Session'}
           </div>
       )}

      <div className="flex space-x-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleTimer}
          className="rounded-full w-10 h-10 shadow-lg hover:scale-105 transition-transform"
        >
          {isActive ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4 ml-0.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={resetTimer}
          className="rounded-full w-10 h-10 hover:bg-white/10"
        >
          <RotateCcwIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
