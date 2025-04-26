import { WIdgetHeader } from './widget-header'
import type { ReactNode } from 'react'

interface WidgetLayoutProps {
  children: ReactNode
  title?: string
  icon?: ReactNode
}

const WidgetLayout = ({ children, title, icon }: WidgetLayoutProps) => {
  return (
    <div className="bg-black/20 backdrop-blur-md text-white h-full w-full overflow-auto p-4 flex flex-col rounded-md border border-accent/20 gap-3">
      <WIdgetHeader title={title} icon={icon} />
      {children}
    </div>
  )
}

export default WidgetLayout
