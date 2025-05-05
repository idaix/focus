import { createFileRoute } from '@tanstack/react-router'
import { TilingLayout, useLayout } from '@/features/layout'
import { WidgetRenderer } from '@/features/widgets'
import type { WidgetType } from '@/types/types'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const layout = useLayout()
  const renderWidget = (
    widgetType: WidgetType,
    widgetID: string,
    onDragStart: (e: React.DragEvent, widgetID: string) => void,
  ) => (
    <WidgetRenderer
      widgetType={widgetType}
      widgetID={widgetID}
      onDragStart={onDragStart}
      onRemove={layout.remove}
    />
  )
  return <TilingLayout {...layout} renderWidget={renderWidget} />
}
