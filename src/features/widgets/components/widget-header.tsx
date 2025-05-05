import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { GripVerticalIcon, X } from 'lucide-react'
import type { ReactNode } from 'react'

interface WidgetHeaderProps {
  title?: string
  icon?: ReactNode
  widgetID: string
  onDragStart: (e: React.DragEvent, widgetID: string) => void
  onRemove: (widgetID: string) => void
}

export function WidgetHeader({
  icon,
  title,
  widgetID,
  onDragStart,
  onRemove,
}: WidgetHeaderProps) {
  return (
    <div
      className="flex items-center justify-between cursor-move group"
      draggable
      onDragStart={(e) => onDragStart(e, widgetID)}
    >
      <div className="flex-1 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(widgetID)}
              >
                <X className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Remove widget</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <GripVerticalIcon className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  )
}
