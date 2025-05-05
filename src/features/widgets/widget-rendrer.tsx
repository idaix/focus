import WidgetLayout from './components/widget-layout'
import { WidgetRegistry } from './registry'

interface Props {
  widgetType: string
  widgetID: string
  onDragStart: (e: React.DragEvent, widgetID: string) => void
  onRemove: (id: string) => void
}

export default function WidgetRenderer({
  widgetType,
  widgetID,
  onDragStart,
  onRemove,
}: Props) {
  const entry = WidgetRegistry[widgetType]

  if (!entry) return <div>Unknown widget: {widgetType}</div>

  const { title, Body, icon } = entry

  return (
    <WidgetLayout
      title={title}
      icon={icon}
      widgetID={widgetID}
      onDragStart={onDragStart}
      onRemove={onRemove}
    >
      <Body widgetID={widgetID} />
    </WidgetLayout>
  )
}
