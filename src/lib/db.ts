import Dexie, { type EntityTable } from 'dexie'

interface Note {
  id: string
  content: string
  color: string
  updatedAt: Date
}

interface PomodoroSettings {
  id: string // 'default'
  workDuration: number
  breakDuration: number
}

interface CalculatorHistory {
  id: number
  expression: string
  result: string
  timestamp: Date
}

interface PomodoroSession {
  id: string
  startTime: Date
  endTime: Date
  duration: number // in seconds
  taskName?: string
}

interface WeatherLocation {
  id: string // 'default' or uuid
  lat: number
  lon: number
  name: string
  isDefault: boolean
}

class FocusDB extends Dexie {
  notes!: EntityTable<Note, 'id'>
  pomodoroSettings!: EntityTable<PomodoroSettings, 'id'>
  pomodoroSessions!: EntityTable<PomodoroSession, 'id'>
  calculatorHistory!: EntityTable<CalculatorHistory, 'id'>
  weatherLocations!: EntityTable<WeatherLocation, 'id'>

  constructor() {
    super('FocusDB')
    this.version(2).stores({
      notes: 'id, updatedAt',
      pomodoroSettings: 'id',
      pomodoroSessions: '++id, startTime, taskName',
      calculatorHistory: '++id, timestamp',
      weatherLocations: 'id, isDefault',
    })
  }
}

export const db = new FocusDB()
