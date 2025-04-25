interface WidgetLayoutProps {
  children: React.ReactNode
}

const WidgetLayout = ({ children }: WidgetLayoutProps) => {
  return (
    <div className="bg-zinc-900 text-white text-shadow-amber-500 h-full w-full overflow-auto p-4 flex flex-col rounded border">
      {children}
    </div>
  )
}

export default WidgetLayout
