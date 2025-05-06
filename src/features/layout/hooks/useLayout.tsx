import { useEffect, useState } from 'react'
import {
  findLastAddedWidget,
  findNodeById,
  updateNodeAtPath,
} from '../lib/utils'
import type {
  SplitDirection,
  SplitPosition,
  WidgetNode,
  WidgetType,
} from '@/types/types'
export const DEFAULT_DIRECTION = 'horizontal'
const LOCAL_STORAGE_KEY = 'widget-tree'

export function useLayout() {
  const [tree, setTree] = useState<WidgetNode | null>(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (tree) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tree))
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
    } catch {}
  }, [tree])

  function add(widgetType: WidgetType) {
    // generate widget id
    const newWidgetID = `widget-${Date.now()}`

    if (!tree) {
      setTree({
        id: newWidgetID,
        type: 'widget',
        widgetType,
      })

      return
    }

    // If there's one widget, Create Container to hold the two widgets
    if (tree.type === 'widget') {
      setTree({
        id: `container-${Date.now()}`,
        type: 'container',
        children: [
          {
            ...tree,
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

    const newTree = JSON.parse(JSON.stringify(tree)) as WidgetNode

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

    setTree(updatedTree)
  }

  function resize(nodeId: string, newSize: number) {
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

    if (tree) {
      setTree(updateNodeSize(tree))
    }
  }

  function swap(sourceID: string, targetID: string) {
    if (!tree) return

    const newTree = JSON.parse(JSON.stringify(tree)) as WidgetNode

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

      setTree(updatedTreeAfterTarget)
    }
  }

  function remove(widgetID: string) {
    if (!tree) return

    // clone tree
    const treeClone = JSON.parse(JSON.stringify(tree)) as WidgetNode

    function processTree(node: WidgetNode): WidgetNode | null {
      if (node.id === widgetID) return null

      if (node.type !== 'container' || !node.children) return node

      const newChildren = node.children
        .map((child) => processTree(child))
        .filter((child) => child != null)

      if (newChildren.length === 1) return newChildren[0]
      if (newChildren.length === 0) return null

      return { ...node, children: newChildren }
    }

    const newTree = processTree(treeClone)

    console.log('tree=', newTree)

    setTree(newTree)
  }

  function split(
    sourceID: string,
    targetID: string,
    position: SplitPosition,
    direction: SplitDirection,
  ) {
    if (!tree) return

    const newTree = JSON.parse(JSON.stringify(tree)) as WidgetNode

    const sourceResult = findNodeById(newTree, sourceID)
    const targetResult = findNodeById(newTree, targetID)

    if (!sourceResult || !targetResult) return

    const sourceWidgetType = sourceResult.node.widgetType

    if (!sourceWidgetType) return

    // create a new widget with the source widget type
    const newWidget: WidgetNode = {
      id: `widget-${Date.now()}`,
      type: 'widget',
      widgetType: sourceWidgetType,
      size: 50,
    }

    // update the target node to be a container
    const updatedTree = updateNodeAtPath(
      newTree,
      targetResult.path,
      (node) => ({
        id: `container-${Date.now()}`,
        type: 'container',
        direction,
        children:
          position === 'before'
            ? [newWidget, { ...node, size: 50 }]
            : [{ ...node, size: 50 }, newWidget],
      }),
    )
    // Remove the source widget (replace it with a placeholder if it's the only widget)
    const removeSourceWidget = (node: WidgetNode): WidgetNode => {
      if (node.id === sourceID) {
        // If this is the root node, we can't remove it
        if (node.id === newTree.id) {
          console.log('Root node')
          return {
            id: `widget-${Date.now()}`,
            type: 'widget',
            widgetType: 'notes', // Default widget type
          }
        }

        // otherwise mark it for removal
        return { ...node, _remove: true }
      }

      if (node.children) {
        const newChildren = node.children
          .map(removeSourceWidget)
          .filter((child) => !child._remove)
        // If this container now has only one child, replace it with that child
        if (node.type === 'container' && newChildren.length === 1) {
          return newChildren[0]
        }

        // If this container now has no children, mark it for removal
        if (node.type === 'container' && newChildren.length === 0) {
          return { ...node, _remove: true }
        }

        return {
          ...node,
          children: newChildren,
        }
      }
      return node
    }

    // Apply the removal logic to the updated tree
    const finalTree = removeSourceWidget(updatedTree)

    setTree(finalTree)
  }

  return { tree, add, resize, swap, split, remove }
}
