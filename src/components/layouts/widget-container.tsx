import type { WidgetNode } from '@/types/types'

interface WidgetContainerProps {
  node: WidgetNode
}

const WidgetContainer = ({ node }: WidgetContainerProps) => {
  return (
    <div className="bg-zinc-300 text-2xl text-white">
      <div className="flex items-center justify-center h-full">
        <h2 className="text-xl font-medium mb-2">{node.widgetType}</h2>
        <p className="text-muted-foreground mb-4">{node.id}</p>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {node.children.map((child) => (
            <WidgetContainer key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default WidgetContainer
