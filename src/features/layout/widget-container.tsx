import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { DEFAULT_DIRECTION } from './layout'
import React, { useRef, useState } from 'react'
import DropZoneIndicator from './components/drop-zone-indicator'
import type {
  DropZone,
  SplitDirection,
  SplitPosition,
  WidgetNode,
  WidgetType,
} from '@/types/types'
interface WidgetContainerProps {
  node: WidgetNode
  renderWidget: (
    widgetType: WidgetType,
    nodeID: string,
    onDragStart: (e: React.DragEvent, widgetID: string) => void,
  ) => React.ReactNode
  onResize: (nodeID: string, newSize: number) => void
  onSwapWidgets: (sourceID: string, targetID: string) => void
  onSplitWidgets: (
    sourceID: string,
    targetID: string,
    position: SplitPosition,
    direction: SplitDirection,
  ) => void
}

const WidgetContainer = ({
  node,
  onResize,
  renderWidget,
  onSwapWidgets,
  onSplitWidgets,
}: WidgetContainerProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [activeDropZone, setActiveDropZone] = useState<DropZone | null>(
    'center',
  )
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (e: React.DragEvent, widgetID: string) => {
    e.dataTransfer.setData('application/widget-id', widgetID)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault() // so the widget can accept the drop.
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) {
      setIsDragOver(true)
    }
    // Determine which drop zone is active based on cursor position
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const width = rect.width
      const height = rect.height

      // Calculate distances from each edge as percentages
      const fromTop = y / height
      const fromLeft = x / width
      const fromRight = 1 - fromLeft
      const fromBottom = 1 - fromTop

      // Center zone is 30% from each edge (the middle 40%)
      const inCenterX = fromLeft > 0.3 && fromRight > 0.3
      const inCenterY = fromTop > 0.3 && fromBottom > 0.3

      if (inCenterX && inCenterY) {
        setActiveDropZone('center')
      } else {
        // Find the closest edge
        const distances = [
          { zone: 'top' as DropZone, distance: fromTop },
          { zone: 'right' as DropZone, distance: fromRight },
          { zone: 'bottom' as DropZone, distance: fromBottom },
          { zone: 'left' as DropZone, distance: fromLeft },
        ]

        const closest = distances.reduce((prev, curr) =>
          curr.distance < prev.distance ? curr : prev,
        )

        setActiveDropZone(closest.zone)
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only consider it a leave if we're actually leaving the container, not entering a child
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      setActiveDropZone(null)
    }
  }

  const handleDrop = (e: React.DragEvent, targetID: string) => {
    e.preventDefault()
    setIsDragOver(false)
    setActiveDropZone(null)

    const sourceID = e.dataTransfer.getData('application/widget-id')

    if (!sourceID || sourceID === targetID) return

    if (activeDropZone === 'center') {
      onSwapWidgets(sourceID, targetID)
    } else {
      // Split the container based on the drop zone
      let direction: SplitDirection
      let position: SplitPosition
      switch (activeDropZone) {
        case 'top':
          direction = 'vertical'
          position = 'before'
          break
        case 'bottom':
          direction = 'vertical'
          position = 'after'
          break
        case 'left':
          direction = 'horizontal'
          position = 'before'
          break
        case 'right':
          direction = 'horizontal'
          position = 'after'
          break
        default:
          return // should never happend
      }

      onSplitWidgets(sourceID, targetID, position, direction)
    }
  }

  // If this is a widget node, render the widget
  if (node.type === 'widget') {
    return (
      <div
        ref={containerRef}
        className={`h-full w-full relative`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
      >
        <DropZoneIndicator activeZone={activeDropZone} isVisibal={isDragOver} />
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
                onSplitWidgets={onSplitWidgets}
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
