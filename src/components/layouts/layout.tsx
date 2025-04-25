import type { WidgetNode, WidgetType } from '@/types/types'
import { useState } from 'react'
import WidgetContainer from './widget-container'
import WidgetSelector from '../widget-selector'
import { findLastAddedWidget, updateNodeAtPath } from '@/lib/utils.widgets'

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

    console.log('PARENT-PATH:', parentPath)

    let parentDirection = DEFAULT_DIRECTION

    if (parentPath.length > 0) {
      console.log('parent path length > 0:')
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

  return (
    <main className="bg-zinc-100 w-full h-screen p-1.5 overflow-hidden">
      {widgetTree ? (
        <>
          <div className="absolute top-1 right-1">
            <WidgetSelector onSelect={addWidget} />
          </div>
          <WidgetContainer node={widgetTree} />
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-2">No Widgets Added</h2>
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
