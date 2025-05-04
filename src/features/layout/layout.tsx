import type { WidgetType } from '@/types/types'
import WidgetContainer from './widget-container'
import WidgetSelector from './components/widget-selector'
import { ClockWidget, TodoWidget } from '@/features/widgets'
import { useLayout } from './hooks/useLayout'

export const DEFAULT_DIRECTION = 'horizontal'

const TilingLayout = () => {
  const { tree, add, resize, split, swap, remove } = useLayout()

  function renderWidget(
    widgetType: WidgetType,
    widgetID: string,
    onDragStart: (e: React.DragEvent, widgetID: string) => void,
  ) {
    switch (widgetType) {
      case 'clock':
        return (
          <ClockWidget
            onRemove={remove}
            onDragStart={onDragStart}
            widgetID={widgetID}
          />
        )
      case 'todo':
        return (
          <TodoWidget
            onRemove={remove}
            onDragStart={onDragStart}
            widgetID={widgetID}
          />
        )
      default:
        return <div>Unknown Widget</div>
    }
  }

  return (
    <main className="bg-zinc-100 w-full h-screen p-2 overflow-hidden bg-image">
      {tree ? (
        <>
          <div className="absolute bottom-2 right-2 z-50">
            <WidgetSelector onSelect={add} asIcon />
          </div>
          <WidgetContainer
            node={tree}
            onResize={resize}
            renderWidget={renderWidget}
            onSwapWidgets={swap}
            onSplitWidgets={split}
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
            <WidgetSelector onSelect={add} />
          </div>
        </div>
      )}
    </main>
  )
}

export default TilingLayout
