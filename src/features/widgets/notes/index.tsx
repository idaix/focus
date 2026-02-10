import { useState, useEffect } from 'react'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { cn } from '@/lib/utils'
import { PlusIcon, TrashIcon, ListIcon, EyeIcon, EyeOffIcon, ChevronLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const COLORS = [
  { name: 'yellow', value: 'bg-yellow-500/20' },
  { name: 'blue', value: 'bg-blue-500/20' },
  { name: 'green', value: 'bg-green-500/20' },
  { name: 'purple', value: 'bg-purple-500/20' },
  { name: 'red', value: 'bg-red-500/20' },
]

export default function NotesWidget() { // WidgetID here acts as a "Box" ID or just ignored?
  // Ideally, a widget instance should just show *one* note, or the *list* of notes?
  // "Multiple Notes" implies the widget is a "Notes App".
  // Let's make it a "Notes App" where you can switch between notes.
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  
  // Query all notes
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray())
  
  // Set active note on load if none
  useEffect(() => {
     if (!activeNoteId && notes && notes.length > 0) {
         setActiveNoteId(notes[0].id)
     }
  }, [notes, activeNoteId])

  const activeNote = notes?.find(n => n.id === activeNoteId)

  const createNote = async () => {
      const id = crypto.randomUUID()
      await db.notes.add({
          id,
          content: '',
          color: COLORS[0].value,
          updatedAt: new Date()
      })
      setActiveNoteId(id)
      setIsSidebarOpen(false)
      setIsPreview(false)
  }

  const deleteNote = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation()
      await db.notes.delete(id)
      if (activeNoteId === id) {
          setActiveNoteId(null)
      }
  }

  const updateContent = (content: string) => {
      if (!activeNoteId) return
      db.notes.update(activeNoteId, { content, updatedAt: new Date() })
  }

  const updateColor = (color: string) => {
      if (!activeNoteId) return
      db.notes.update(activeNoteId, { color, updatedAt: new Date() })
  }

  // Simple Markdown Renderer
  const renderMarkdown = (text: string) => {
      if (!text) return <span className="text-muted-foreground italic">Empty note...</span>
      
      return text.split('\n').map((line, i) => {
          // Headers
          if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mb-2">{line.slice(2)}</h1>
          if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mb-2">{line.slice(3)}</h2>
          // Lists
          if (line.trim().startsWith('- ')) return <li key={i} className="ml-4">{line.trim().slice(2)}</li>
          // Empty
          if (line.trim() === '') return <div key={i} className="h-2"></div>
          
          return <p key={i} className="min-h-[1.5em]">{line}</p>
      })
  }

  if (!notes || notes.length === 0) {
      // Empty state
      return (
          <div className="h-full flex flex-col items-center justify-center p-4 text-center space-y-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <ListIcon className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-sm text-muted-foreground">No notes yet</p>
              <Button onClick={createNote} size="sm" variant="outline">Create Note</Button>
          </div>
      )
  }

  return (
    <div className={cn("h-full flex flex-col transition-colors duration-300 relative overflow-hidden", activeNote?.color || 'bg-background/50')}>
      
      {/* Sidebar Overlay */}
      <div className={cn(
          "absolute inset-0 bg-background/95 z-20 transition-transform duration-300 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
          <div className="p-3 border-b flex justify-between items-center">
              <span className="font-semibold text-sm">All Notes ({notes.length})</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSidebarOpen(false)}>
                  <ChevronLeftIcon className="h-4 w-4" />
              </Button>
          </div>
          <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                  {notes.map(note => (
                      <div 
                        key={note.id} 
                        className={cn(
                            "group flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-accent/50 text-sm",
                            activeNoteId === note.id && "bg-accent"
                        )}
                        onClick={() => { setActiveNoteId(note.id); setIsSidebarOpen(false); }}
                      >
                          <div className="truncate flex-1 font-medium pr-2">
                              {note.content.split('\n')[0] || 'Untitled Note'}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/20"
                            onClick={(e) => deleteNote(e, note.id)}
                          >
                              <TrashIcon className="h-3 w-3" />
                          </Button>
                      </div>
                  ))}
              </div>
          </ScrollArea>
           <div className="p-2 border-t">
              <Button onClick={createNote} className="w-full" size="sm">
                  <PlusIcon className="w-4 h-4 mr-2" /> New Note
              </Button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full">
          {/* Toolbar */}
          <div className="flex justify-between items-center p-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/20 to-transparent">
               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSidebarOpen(true)}>
                  <ListIcon className="h-4 w-4" />
              </Button>
               <div className="flex gap-1">
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsPreview(!isPreview)}>
                    {isPreview ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                 </Button>
                 {COLORS.map((c) => (
                    <button
                        key={c.name}
                        className={cn(
                        "w-3 h-3 rounded-full border border-white/20 shadow-sm",
                        c.value.replace('/20', '')
                        )}
                        onClick={() => updateColor(c.value)}
                    />
                 ))}
               </div>
          </div>

          {/* Editor / Preview */}
          <div className="flex-1 p-4 pt-8 overflow-y-auto widget-scrollbar">
              {isPreview ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                      {renderMarkdown(activeNote?.content || '')}
                  </div>
              ) : (
                <textarea
                    className="w-full h-full bg-transparent border-none resize-none focus:outline-hidden text-sm font-medium placeholder:text-muted-foreground/50 leading-relaxed"
                    placeholder="Type your notes here..."
                    value={activeNote?.content || ''}
                    onChange={(e) => updateContent(e.target.value)}
                />
              )}
          </div>
      </div>
    </div>
  )
}
