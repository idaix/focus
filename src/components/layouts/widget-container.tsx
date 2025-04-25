import type { WidgetNode } from '@/types/types'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { DEFAULT_DIRECTION } from './layout'
import React from 'react'
import WidgetLayout from './widget-layout'

interface WidgetContainerProps {
  node: WidgetNode
}

const WidgetContainer = ({ node }: WidgetContainerProps) => {
  // If this is a widget node, render the widget
  if (node.type === 'widget') {
    return <WidgetLayout>{node.widgetType}</WidgetLayout>
  }

  // If this is a container node, render its children with resiable panel
  return (
    <ResizablePanelGroup
      direction={node.direction || DEFAULT_DIRECTION}
      className="w-full h-full"
    >
      {node.children?.map((child) => (
        <React.Fragment key={child.id}>
          <ResizablePanel
            defaultSize={child.size || 50}
            minSize={10}
            className="h-full"
          >
            <WidgetContainer node={child} />
          </ResizablePanel>
        </React.Fragment>
      ))}
    </ResizablePanelGroup>
  )
}

export default WidgetContainer
