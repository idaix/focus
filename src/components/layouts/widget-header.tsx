import { GripVerticalIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface WidgetHeaderProps {
  title?: string
  icon?: ReactNode
}

export function WIdgetHeader({ icon, title }: WidgetHeaderProps) {
  return (
    <div className="flex items-center justify-between cursor-move" draggable>
      <div className="flex-1 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <GripVerticalIcon className="w-4 h-4 text-muted-foreground" />
    </div>
  )
}
