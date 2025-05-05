import { TilingLayout, useLayout } from '@/features/layout'
import { ClockWidget, TodoWidget } from '@/features/widgets'
import type { WidgetType } from '@/types/types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const layout = useLayout()
  function renderWidget(
    widgetType: WidgetType,
    widgetID: string,
    onDragStart: (e: React.DragEvent, widgetID: string) => void,
  ) {
    switch (widgetType) {
      case 'clock':
        return (
          <ClockWidget
            onRemove={layout.remove}
            onDragStart={onDragStart}
            widgetID={widgetID}
          />
        )
      case 'todo':
        return (
          <TodoWidget
            onRemove={layout.remove}
            onDragStart={onDragStart}
            widgetID={widgetID}
          />
        )
      default:
        return <div>Unknown Widget</div>
    }
  }
  return <TilingLayout {...layout} renderWidget={renderWidget} />
}
