import type { WidgetNode, WidgetType } from '@/types/types'
import { useState } from 'react'
import WidgetContainer from './widget-container'
import WidgetSelector from '../widget-selector'

const TilingLayout = () => {
  const [widgetTree, setWidgetTree] = useState<WidgetNode | null>(null)

  function onSelect(widgetType: WidgetType) {
    console.log(`Hello ${widgetType}`)
  }

  return (
    <main className="bg-zinc-100 w-full h-screen p-1.5 overflow-hidden">
      {widgetTree ? (
        <>
          <div className="absolute top-1 right-1">
            <WidgetSelector onSelect={onSelect} />
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
            <WidgetSelector onSelect={onSelect} />
          </div>
        </div>
      )}
    </main>
  )
}

export default TilingLayout
