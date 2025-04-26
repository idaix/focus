import type { WidgetNode, WidgetType } from '@/types/types'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { DEFAULT_DIRECTION } from './layout'
import React from 'react'

interface WidgetContainerProps {
  node: WidgetNode
  renderWidget: (widgetType: WidgetType) => React.ReactNode
  onResize: (nodeID: string, newSize: number) => void
}

const WidgetContainer = ({
  node,
  onResize,
  renderWidget,
}: WidgetContainerProps) => {
  // If this is a widget node, render the widget
  if (node.type === 'widget') {
    return renderWidget(node.widgetType!)
  }

  // If this is a container node, render its children with resiable panel
  if (node.type === 'container') {
    return (
      <ResizablePanelGroup
        direction={node.direction || DEFAULT_DIRECTION}
        className="w-full h-full"
      >
        {node.children?.map((child, index) => (
          <React.Fragment key={child.id}>
            <ResizablePanel
              defaultSize={child.size || 50}
              minSize={10}
              onResize={(size) => onResize(child.id, size)}
              className="h-full"
            >
              <WidgetContainer
                node={child}
                onResize={onResize}
                renderWidget={renderWidget}
              />
            </ResizablePanel>
            {index < node.children!.length - 1 && (
              <ResizableHandle className="bg-transparent p-1" />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    )
  }

  // Fallback for empty containers
  return <div className="h-full w-full bg-muted/20" />
}

export default WidgetContainer
