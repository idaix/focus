export type WidgetType = 'todo' | 'clock' | 'weather' | 'music' | 'notes'

export type WidgetNode = {
  id: string
  type: 'widget' | 'container'
  direction?: 'horizontal' | 'vertical'
  widgetType?: WidgetType
  children?: WidgetNode[] // self reference
  size?: number
}

export type WidgetOption = {
  type: WidgetType
  name: string
  description: string
  icon: React.ReactNode
}

export interface WidgetProps {
  widgetID: string
  onDragStart: (e: React.DragEvent, widgetID: string) => void
}
