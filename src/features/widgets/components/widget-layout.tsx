import { WIdgetHeader } from './widget-header'
import type { ReactNode } from 'react'

interface WidgetLayoutProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
  widgetID: string
  onDragStart: (e: React.DragEvent, widgetID: string) => void
}

const WidgetLayout = ({
  children,
  title,
  icon,
  onDragStart,
  widgetID,
}: WidgetLayoutProps) => {
  return (
    <div className="bg-black/20 backdrop-blur-md text-white h-full w-full overflow-auto p-4 flex flex-col rounded-md border border-accent/20 gap-3">
      <WIdgetHeader
        title={title}
        icon={icon}
        onDragStart={onDragStart}
        widgetID={widgetID}
      />
      {children}
    </div>
  )
}

export default WidgetLayout
