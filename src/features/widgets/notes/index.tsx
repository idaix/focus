import { useState, useEffect } from 'react'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { cn } from '@/lib/utils'
import {
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  CheckIcon,
  XIcon,
  SearchIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

const COLORS = [
  {
    name: 'yellow',
    bg: 'bg-amber-500/10',
    darkBg: 'dark:bg-amber-500/15',
    border: 'border-amber-500/20',
    darkBorder: 'dark:border-amber-500/20',
    accent: 'bg-amber-500 dark:bg-amber-400',
  },
  {
    name: 'blue',
    bg: 'bg-sky-500/10',
    darkBg: 'dark:bg-sky-500/15',
    border: 'border-sky-500/20',
    darkBorder: 'dark:border-sky-500/20',
    accent: 'bg-sky-500 dark:bg-sky-400',
  },
  {
    name: 'green',
    bg: 'bg-emerald-500/10',
    darkBg: 'dark:bg-emerald-500/15',
    border: 'border-emerald-500/20',
    darkBorder: 'dark:border-emerald-500/20',
    accent: 'bg-emerald-500 dark:bg-emerald-400',
  },
  {
    name: 'purple',
    bg: 'bg-violet-500/10',
    darkBg: 'dark:bg-violet-500/15',
    border: 'border-violet-500/20',
    darkBorder: 'dark:border-violet-500/20',
    accent: 'bg-violet-500 dark:bg-violet-400',
  },
  {
    name: 'red',
    bg: 'bg-rose-500/10',
    darkBg: 'dark:bg-rose-500/15',
    border: 'border-rose-500/20',
    darkBorder: 'dark:border-rose-500/20',
    accent: 'bg-rose-500 dark:bg-rose-400',
  },
  {
    name: 'gray',
    bg: 'bg-zinc-500/10',
    darkBg: 'dark:bg-zinc-400/10',
    border: 'border-zinc-500/20',
    darkBorder: 'dark:border-zinc-500/20',
    accent: 'bg-zinc-500 dark:bg-zinc-400',
  },
]

// Minimalist transition presets
const fadeSlide = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: 'easeInOut' as const },
}

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 },
}

export default function NotesWidget() {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const notes = useLiveQuery(() =>
    db.notes.orderBy('updatedAt').reverse().toArray(),
  )

  const activeNote = notes?.find((n) => n.id === activeNoteId)

  const filteredNotes = notes?.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const createNote = async () => {
    const id = crypto.randomUUID()
    const defaultColor = COLORS[0]
    await db.notes.add({
      id,
      content: '',
      color: `${defaultColor.bg} ${defaultColor.darkBg} ${defaultColor.border} ${defaultColor.darkBorder}`,
      updatedAt: new Date(),
    })
    setActiveNoteId(id)
    setSearchQuery('')
  }

  const deleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await db.notes.delete(id)
    if (activeNoteId === id) setActiveNoteId(null)
  }

  const updateContent = (content: string) => {
    if (!activeNoteId) return
    db.notes.update(activeNoteId, { content, updatedAt: new Date() })
  }

  const updateColor = (colorObj: (typeof COLORS)[0]) => {
    if (!activeNoteId) return
    const colorString = `${colorObj.bg} ${colorObj.darkBg} ${colorObj.border} ${colorObj.darkBorder}`
    db.notes.update(activeNoteId, { color: colorString, updatedAt: new Date() })
    setIsColorPickerOpen(false)
  }

  const getColorAccent = (colorString: string) => {
    if (!colorString) return 'bg-zinc-400'
    const matchedColor = COLORS.find((c) => colorString.includes(c.bg))
    return matchedColor ? matchedColor.accent : 'bg-zinc-400'
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        createNote()
      }
      if (e.key === 'Escape' && activeNoteId) {
        setActiveNoteId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeNoteId])

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col">
      <AnimatePresence mode="wait" initial={false}>
        {!activeNoteId ? (
          <motion.div
            key="list"
            {...fadeSlide}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="px-3 pt-3 pb-2 z-10 sticky top-0 flex gap-2 items-center">
              <div className="relative group flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-9 pr-4 text-sm bg-black/5 dark:bg-white/5 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/20 transition-colors placeholder:text-muted-foreground/40"
                  spellCheck={false}
                />
              </div>
              <Button
                onClick={createNote}
                size="icon"
                variant="ghost"
                className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Grid List */}
            <ScrollArea className="flex-1 px-3 py-2">
              <div className="grid grid-cols-2 gap-3 pb-6">
                <AnimatePresence mode="popLayout">
                  {filteredNotes?.map((note) => (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' as const }}
                      onClick={() => setActiveNoteId(note.id)}
                      className={cn(
                        'group relative p-4 rounded-2xl border cursor-pointer transition-colors duration-150 flex flex-col h-[140px] overflow-hidden shadow-sm hover:shadow-md',
                        note.color || 'bg-background/50 border-white/10',
                      )}
                    >
                      <div className="relative z-10 flex-1">
                        <p
                          className={cn(
                            'text-sm leading-relaxed line-clamp-4 w-full break-words text-foreground/90 font-medium',
                            !note.content &&
                              'text-muted-foreground/40 italic font-normal',
                          )}
                        >
                          {note.content || 'Empty note...'}
                        </p>
                      </div>

                      <div className="relative z-10 mt-auto pt-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-2 h-2 rounded-full',
                              getColorAccent(note.color),
                            )}
                          />
                          <span className="text-[10px] font-medium text-muted-foreground/60 tracking-wide uppercase">
                            {format(note.updatedAt, 'MMM d')}
                          </span>
                        </div>

                        <AnimatePresence mode="wait">
                          {deleteConfirmId === note.id ? (
                            <motion.div
                              key="confirm"
                              {...fadeIn}
                              className="flex gap-1 -mr-2 bg-background/50 backdrop-blur-md rounded-lg p-0.5 border border-white/10"
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20"
                                onClick={(e) => {
                                  deleteNote(e, note.id)
                                  setDeleteConfirmId(null)
                                }}
                              >
                                <CheckIcon className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteConfirmId(null)
                                }}
                              >
                                <XIcon className="w-3 h-3" />
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div key="trash" {...fadeIn}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-150 -mr-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setDeleteConfirmId(note.id)
                                }}
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredNotes?.length === 0 && (
                <motion.div
                  {...fadeIn}
                  className="flex flex-col items-center justify-center py-12 px-6 text-center h-full"
                >
                  <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                    <PlusIcon className="w-6 h-6 text-primary/60" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {searchQuery ? 'No matching notes' : 'Capture an idea'}
                  </h3>
                  <p className="text-xs text-muted-foreground/70 mb-4 max-w-[200px] leading-relaxed">
                    {searchQuery
                      ? 'Try adjusting your search terms.'
                      : 'Your space for quick thoughts.'}
                  </p>
                </motion.div>
              )}
            </ScrollArea>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            {...fadeSlide}
            className={cn(
              'h-full flex flex-col absolute inset-0 z-20 bg-background/80 backdrop-blur-sm',
              activeNote?.color,
            )}
          >
            {/* Editor Toolbar */}
            <div className="px-3 py-2 flex justify-between items-center border-b border-black/5 dark:border-white/5 sticky top-0 z-30">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 pl-1.5 pr-3 text-foreground/70 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                onClick={() => setActiveNoteId(null)}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="text-xs font-medium">Back</span>
              </Button>

              <div className="flex items-center gap-1">
                <span className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest hidden sm:inline-block mr-2">
                  {format(activeNote?.updatedAt || new Date(), 'h:mm a')}
                </span>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  >
                    <div
                      className={cn(
                        'w-3.5 h-3.5 rounded-full ring-1 ring-white/20',
                        getColorAccent(activeNote?.color || ''),
                      )}
                    />
                  </Button>

                  <AnimatePresence>
                    {isColorPickerOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsColorPickerOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{
                            duration: 0.15,
                            ease: 'easeOut' as const,
                          }}
                          className="absolute right-0 top-full mt-2 p-2 bg-background/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/10 grid grid-cols-3 gap-1.5 z-50 w-auto min-w-[120px]"
                        >
                          {COLORS.map((c) => (
                            <button
                              key={c.name}
                              className={cn(
                                'w-7 h-7 rounded-full border border-white/10 transition-transform duration-150 hover:scale-110',
                                c.bg,
                                activeNote?.color?.includes(c.bg) &&
                                  'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110',
                              )}
                              onClick={() => updateColor(c)}
                              title={c.name}
                            />
                          ))}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={(e) => {
                    if (activeNote) {
                      deleteNote(e, activeNote.id)
                    }
                  }}
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Editor Textarea */}
            <div className="flex-1 relative overflow-hidden">
              <textarea
                className="w-full h-full p-4 bg-transparent border-none resize-none focus:outline-none focus:ring-0 text-sm leading-relaxed text-foreground/90 placeholder:text-muted-foreground/40 font-medium"
                placeholder="What's on your mind?"
                value={activeNote?.content || ''}
                onChange={(e) => updateContent(e.target.value)}
                autoFocus
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
