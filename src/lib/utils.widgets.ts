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
