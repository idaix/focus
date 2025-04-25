interface WidgetLayoutProps {
  children: React.ReactNode
}

const WidgetLayout = ({ children }: WidgetLayoutProps) => {
  return (
    <div className="bg-zinc-400 h-full w-full overflow-auto p-4 flex flex-col rounded border">
      {children}
    </div>
  )
}

export default WidgetLayout
