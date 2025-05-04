import type { WidgetNode } from '@/types/types'

export function findLastAddedWidget(node: WidgetNode): {
  node: WidgetNode
  path: number[]
} {
  if (node.type === 'widget') {
    return { node, path: [] }
  }

  if (!node.children || node.children.length === 0) {
    return { node, path: [] }
  }

  const lastChildIndex = node.children.length - 1
  const result = findLastAddedWidget(node.children[lastChildIndex])

  return {
    node: result.node,
    path: [lastChildIndex, ...result.path],
  }
}

export function updateNodeAtPath(
  node: WidgetNode,
  path: number[],
  updater: (node: WidgetNode) => WidgetNode,
): WidgetNode {
  // Base case: no more path left → we’re at the target node
  if (path.length === 0) {
    return updater(node)
  }

  const [currentIndex, ...restPath] = path

  // Clone the children array so we don’t mutate the original
  const newChildren = [...(node.children || [])]

  // Recursively update the chosen child:
  newChildren[currentIndex] = updateNodeAtPath(
    newChildren[currentIndex],
    restPath,
    updater,
  )
  return { ...node, children: newChildren }
}

export function findNodeById(
  node: WidgetNode,
  id: string,
): { node: WidgetNode; path: number[] } | null {
  if (node.id === id) {
    return { node, path: [] }
  }

  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const result = findNodeById(node.children[i], id)

      if (result) {
        return { node: result.node, path: [i, ...result.path] }
      }
    }
  }

  return null
}

export function removeMarkedWidget(node: WidgetNode): WidgetNode {
  if (node.children) {
    const newChildren = node.children
      .map(removeMarkedWidget)
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
