import type { WidgetNode, WidgetType } from '@/types/types'
import { useState } from 'react'
import WidgetContainer from './widget-container'
import WidgetSelector from '../widget-selector'
import {
  findLastAddedWidget,
  findNodeById,
  updateNodeAtPath,
} from '@/lib/utils.widgets'
import { ClockWidget, TodoWidget } from '../widgets'

export const DEFAULT_DIRECTION = 'horizontal'

const TilingLayout = () => {
  const [widgetTree, setWidgetTree] = useState<WidgetNode | null>(null)

  function addWidget(widgetType: WidgetType) {
    // generate widget id
    const newWidgetID = `widget-${Date.now()}`

    if (!widgetTree) {
      setWidgetTree({
        id: newWidgetID,
        type: 'widget',
        widgetType,
      })

      return
    }

    // If there's one widget, Create Container to hold the two widgets
    if (widgetTree.type === 'widget') {
      setWidgetTree({
        id: `container-${Date.now()}`,
        type: 'container',
        children: [
          {
            ...widgetTree,
            size: 50,
          },
          {
            id: newWidgetID,
            type: 'widget',
            widgetType,
            size: 50,
          },
        ],
      })

      return
    }

    const newTree = JSON.parse(JSON.stringify(widgetTree)) as WidgetNode

    const { node, path } = findLastAddedWidget(newTree)
    console.log('NODE:', node, path)

    const parentPath = path.slice(0, -1)

    let parentDirection = DEFAULT_DIRECTION

    if (parentPath.length > 0) {
      let parent = newTree

      for (const index of parentPath) {
        parent = parent.children![index]
      }

      parentDirection = parent.direction || 'horizontal'
    }

    const newDirection =
      parentDirection === 'horizontal' ? 'vertical' : 'horizontal'

    // Update the tree by replacing the last widget with a container
    // Render the new widget besides the last widget in that container [50% | 50%]
    const updatedTree = updateNodeAtPath(newTree, path, (node) => {
      return {
        id: `container-${Date.now()}`,
        type: 'container',
        direction: newDirection,
        children: [
          { ...node, size: 50 }, // older widget
          {
            id: newWidgetID,
            type: 'widget',
            widgetType,
            size: 50,
          }, // new widget
        ],
      }
    })

    setWidgetTree(updatedTree)
  }

  function renderWidget(
    widgetType: WidgetType,
    widgetID: string,
    onDragStart: (e: React.DragEvent, widgetID: string) => void,
  ) {
    switch (widgetType) {
      case 'clock':
        return <ClockWidget onDragStart={onDragStart} widgetID={widgetID} />
      case 'todo':
        return <TodoWidget onDragStart={onDragStart} widgetID={widgetID} />
      default:
        return <div>Unknown Widget</div>
    }
  }

  function handleResize(nodeId: string, newSize: number) {
    const updateNodeSize = (node: WidgetNode): WidgetNode => {
      if (node.id === nodeId) {
        return { ...node, size: newSize }
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeSize),
        }
      }

      return node
    }

    if (widgetTree) {
      setWidgetTree(updateNodeSize(widgetTree))
    }
  }

  function handleSwapWidgets(sourceID: string, targetID: string) {
    if (!widgetTree) return

    const newTree = JSON.parse(JSON.stringify(widgetTree)) as WidgetNode

    const sourceResult = findNodeById(newTree, sourceID)
    const targetResult = findNodeById(newTree, targetID)

    if (!sourceResult || !targetResult) return

    const sourceWidgetType = sourceResult.node.widgetType
    const targetWidgetType = targetResult.node.widgetType

    if (sourceWidgetType && targetWidgetType) {
      const updatedTreeAfterSource = updateNodeAtPath(
        newTree,
        sourceResult.path,
        (node) => ({ ...node, widgetType: targetWidgetType }),
      )

      const updatedTreeAfterTarget = updateNodeAtPath(
        updatedTreeAfterSource,
        targetResult.path,
        (node) => ({ ...node, widgetType: sourceWidgetType }),
      )

      setWidgetTree(updatedTreeAfterTarget)
    }
  }

  return (
    <main className="bg-zinc-100 w-full h-screen p-2 overflow-hidden bg-image">
      {widgetTree ? (
        <>
          <div className="absolute bottom-2 right-2 z-50">
            <WidgetSelector onSelect={addWidget} asIcon />
          </div>
          <WidgetContainer
            node={widgetTree}
            onResize={handleResize}
            renderWidget={renderWidget}
            onSwapWidgets={handleSwapWidgets}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2 text-muted-foreground">
              No Widgets Added
            </h2>
            <p className="text-muted-foreground mb-4">
              Add your first widget to get started
            </p>
            <WidgetSelector onSelect={addWidget} />
          </div>
        </div>
      )}
    </main>
  )
}

export default TilingLayout
