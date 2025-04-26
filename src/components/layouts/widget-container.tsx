import type { WidgetNode, WidgetType } from '@/types/types'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { DEFAULT_DIRECTION } from './layout'
import React, { useState } from 'react'

interface WidgetContainerProps {
  node: WidgetNode
  renderWidget: (
    widgetType: WidgetType,
    nodeID: string,
    onDragStart: (e: React.DragEvent, widgetID: string) => void,
  ) => React.ReactNode
  onResize: (nodeID: string, newSize: number) => void
  onSwapWidgets: (sourceID: string, targetID: string) => void
}

const WidgetContainer = ({
  node,
  onResize,
  renderWidget,
  onSwapWidgets,
}: WidgetContainerProps) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragStart = (e: React.DragEvent, widgetID: string) => {
    e.dataTransfer.setData('application/widget-id', widgetID)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // so the widget can accept the drop.
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent, targetID: string) => {
    e.preventDefault()
    setIsDragOver(false)

    const sourceID = e.dataTransfer.getData('application/widget-id')

    if (sourceID && sourceID !== targetID) {
      onSwapWidgets(sourceID, targetID)
    }
  }

  // If this is a widget node, render the widget
  if (node.type === 'widget') {
    return (
      <div
        className={`h-full w-full  ${isDragOver ? 'bg-primary/10 border-2 border-dashed border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
      >
        {renderWidget(node.widgetType!, node.id, handleDragStart)}
      </div>
    )
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
                onSwapWidgets={onSwapWidgets}
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
