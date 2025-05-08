import { Button } from '@/components/ui/button'
import type { ReactNode } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EllipsisVerticalIcon, X } from 'lucide-react'

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
      className="flex items-center cursor-move group px-3 py-1"
      draggable
      onDragStart={(e) => onDragStart(e, widgetID)}
    >
      <div className="flex-1 flex items-center gap-2">
        {icon}
        <h2 className="font-medium text-muted-foreground">{title}</h2>
      </div>

      <div className="me-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={() => onRemove(widgetID)}
                variant="destructive"
              >
                <X className="h-4 w-4" />
                Close widget
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
