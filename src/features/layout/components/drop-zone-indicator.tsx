import type { DropZone } from '@/types/types'
import { cn } from '@/lib/utils'

interface DropZoneIndicatorProps {
  activeZone: DropZone | null
  isVisibal: boolean
}

const zones = [
  {
    id: 'top',
    position: 'top-0 left-0 right-0 h-1/2 rounded-t-md',
    label: 'Split Top',
  },
  {
    id: 'right',
    position: 'top-0 right-0 bottom-0 w-1/2 rounded-r-md',
    label: 'Split Right',
  },
  {
    id: 'bottom',
    position: 'bottom-0 left-0 right-0 h-1/2 rounded-b-md',
    label: 'Split Bottom',
  },
  {
    id: 'left',
    position: 'top-0 left-0 bottom-0 w-1/2 rounded-l-md',
    label: 'Split Left',
  },
  {
    id: 'center',
    position: 'inset-[20%] rounded-md',
    label: 'Swap Widgets',
  },
] as const

const DropZoneIndicator = ({
  activeZone,
  isVisibal,
}: DropZoneIndicatorProps) => {
  if (!isVisibal) return null

  return (
    <div className="absolute pointer-events-none inset-0 z-50">
      {zones.map(({ id, position, label }) => (
        <div
          key={id}
          className={cn(
            'absolute border-2 border-dashed transition-opacity duration-200',
            position,
            activeZone === id
              ? 'opacity-100 bg-primary-foreground/10 backdrop-blur-md'
              : 'opacity-0',
          )}
        >
          {activeZone === id && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-primary/50 rounded-md px-3 py-1 text-sm font-medium text-primary-foreground">
                {label}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DropZoneIndicator
