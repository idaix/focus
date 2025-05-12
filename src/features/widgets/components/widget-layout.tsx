import { WidgetHeader } from './widget-header'
import type { ReactNode } from 'react'

interface WidgetLayoutProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
  widgetID: string
  onDragStart: (e: React.DragEvent, widgetID: string) => void
  onRemove: (widgetID: string) => void
}

const WidgetLayout = ({
  children,
  title,
  icon,
  onDragStart,
  widgetID,
  onRemove,
}: WidgetLayoutProps) => {
  return (
    <div className="bg-black/20 backdrop-blur-md text-white h-full w-full flex flex-col rounded-md border border-accent/20 hover:border-secondary duration-300">
      <WidgetHeader
        title={title}
        icon={icon}
        onDragStart={onDragStart}
        widgetID={widgetID}
        onRemove={onRemove}
      />
      <div className="p-3 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}

export default WidgetLayout
