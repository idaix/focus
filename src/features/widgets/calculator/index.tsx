import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { HistoryIcon, TrashIcon, CalculatorIcon, ArrowRightLeftIcon, PiIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const safeEvaluate = (expression: string) => {
  try {
    // Sanitization and substitution for Math functions
    let sanitized = expression
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pi/g, 'Math.PI')
        .replace(/\^/g, '**')
    
    // Basic formatting safety check
    if (/[^0-9+\-*/().\sMath.sincotalogeEPIqr]/.test(sanitized)) return 'Error'

    // eslint-disable-next-line
    return new Function('return ' + sanitized)()
  } catch {
    return 'Error'
  }
}

export default function CalculatorWidget() {
  const [display, setDisplay] = useState('')
  const [mode, setMode] = useState<'basic' | 'scientific' | 'converter'>('basic')
  const [showHistory, setShowHistory] = useState(false)
  
  // Converter State
  const [convertValue, setConvertValue] = useState('')
  const [convertType, setConvertType] = useState('length')
  const [convertFrom, setConvertFrom] = useState('m')
  const [convertTo, setConvertTo] = useState('ft')

  const history = useLiveQuery(() => db.calculatorHistory.orderBy('timestamp').reverse().limit(10).toArray())

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('')
    } else if (val === '=') {
      const result = safeEvaluate(display)
      setDisplay(result.toString())
      if (result !== 'Error') {
        db.calculatorHistory.add({
          expression: display,
          result: result.toString(),
          timestamp: new Date(),
        })
      }
    } else {
      setDisplay((prev) => prev + val)
    }
  }

  const convert = (val: number, type: string, from: string, to: string) => {
      if (isNaN(val)) return '---'
      if (from === to) return val
      
      let base = val
      // To Base
      if (type === 'length') {
          if (from === 'ft') base = val / 3.28084
          if (from === 'cm') base = val / 100
          if (from === 'in') base = val / 39.3701
      } else if (type === 'weight') {
          if (from === 'lb') base = val * 0.453592
          if (from === 'oz') base = val * 0.0283495
      }

      // From Base
      if (type === 'length') {
          if (to === 'ft') return (base * 3.28084).toFixed(2)
          if (to === 'cm') return (base * 100).toFixed(2)
          if (to === 'in') return (base * 39.3701).toFixed(2)
          if (to === 'm') return base.toFixed(2)
      } else if (type === 'weight') {
          if (to === 'lb') return (base / 0.453592).toFixed(2)
          if (to === 'oz') return (base / 0.0283495).toFixed(2)
          if (to === 'kg') return base.toFixed(2)
      }
      return base.toFixed(2)
  }

  if (mode === 'converter') {
      return (
          <div className="h-full flex flex-col p-4 space-y-4">
               <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Unit Converter</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMode('basic')}>
                        <CalculatorIcon className="h-4 w-4" />
                    </Button>
               </div>
               <div className="flex gap-2 p-1 bg-secondary/20 rounded-md">
                   <Button variant={convertType === 'length' ? 'secondary' : 'ghost'} size="sm" className="flex-1 text-xs" onClick={() => setConvertType('length')}>Length</Button>
                   <Button variant={convertType === 'weight' ? 'secondary' : 'ghost'} size="sm" className="flex-1 text-xs" onClick={() => setConvertType('weight')}>Weight</Button>
               </div>
               
               <div className="space-y-4">
                   <div className="flex gap-2">
                       <Input 
                            type="number" 
                            className="flex-1" 
                            value={convertValue} 
                            onChange={(e) => setConvertValue(e.target.value)} 
                            placeholder="Value"
                       />
                   </div>
                   <div className="flex items-center gap-2">
                       <Select value={convertFrom} onValueChange={setConvertFrom}>
                           <SelectTrigger className="w-[80px]">
                               <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                               {convertType === 'length' ? (
                                   <>
                                    <SelectItem value="m">m</SelectItem>
                                    <SelectItem value="ft">ft</SelectItem>
                                    <SelectItem value="cm">cm</SelectItem>
                                    <SelectItem value="in">in</SelectItem>
                                   </>
                               ) : (
                                   <>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="lb">lb</SelectItem>
                                    <SelectItem value="oz">oz</SelectItem>
                                   </>
                               )}
                           </SelectContent>
                       </Select>
                       <ArrowRightLeftIcon className="w-4 h-4 text-muted-foreground" />
                       <Select value={convertTo} onValueChange={setConvertTo}>
                           <SelectTrigger className="w-[80px]">
                               <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                               {convertType === 'length' ? (
                                   <>
                                    <SelectItem value="m">m</SelectItem>
                                    <SelectItem value="ft">ft</SelectItem>
                                    <SelectItem value="cm">cm</SelectItem>
                                    <SelectItem value="in">in</SelectItem>
                                   </>
                               ) : (
                                   <>
                                    <SelectItem value="kg">kg</SelectItem>
                                    <SelectItem value="lb">lb</SelectItem>
                                    <SelectItem value="oz">oz</SelectItem>
                                   </>
                               )}
                           </SelectContent>
                       </Select>
                   </div>
                   <div className="text-center text-3xl font-bold p-4 bg-secondary/10 rounded-md">
                       {convert(parseFloat(convertValue), convertType, convertFrom, convertTo)} <span className="text-sm font-normal text-muted-foreground">{convertTo}</span>
                   </div>
               </div>
          </div>
      )
  }

  return (
    <div className="h-full flex flex-col p-2 relative">
      <div className="flex justify-between mb-2 gap-1">
         
         <div className="flex-1 text-right text-xl font-mono truncate p-2 bg-secondary/20 rounded-md h-10 flex items-center justify-end">
            {display || '0'}
         </div>
      </div>
      
      <div className="absolute top-2 left-2 flex gap-1 z-10">
         <Button variant="ghost" size="icon" className="h-6 w-6 opacity-30 hover:opacity-100" onClick={() => setShowHistory(!showHistory)}>
            <HistoryIcon className="h-4 w-4" />
         </Button>
         <Button variant="ghost" size="icon" className="h-6 w-6 opacity-30 hover:opacity-100" onClick={() => setMode(mode === 'basic' ? 'scientific' : 'basic')}>
             {mode === 'basic' ? <span className="text-xs font-bold">Sci</span> : <span className="text-xs font-bold">Bas</span>}
         </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-30 hover:opacity-100" onClick={() => setMode('converter')}>
            <ArrowRightLeftIcon className="h-3 w-3" />
         </Button>
      </div>

      {showHistory ? (
        <div className="flex-1 overflow-y-auto space-y-2 p-1 bg-black/40 rounded-md backdrop-blur-sm z-20 absolute inset-x-2 bottom-2 top-12">
            <div className="flex justify-between items-center p-2 border-b border-white/10">
                <span className="text-xs font-bold">History</span>
                <Button variant="ghost" size="icon" className="h-4 w-4" onClick={() => db.calculatorHistory.clear()}>
                    <TrashIcon className="h-3 w-3" />
                </Button>
            </div>
            {history?.map((h) => (
                <div key={h.id} className="text-xs p-1 hover:bg-white/5 rounded-sm cursor-pointer" onClick={() => { setDisplay(h.expression); setShowHistory(false); }}>
                    <div className="text-muted-foreground">{h.expression} =</div>
                    <div className="font-bold text-right">{h.result}</div>
                </div>
            ))}
             {history?.length === 0 && <div className="text-center text-xs text-muted-foreground p-4">No history</div>}
        </div>
      ) : (
        <div className="grid gap-1 flex-1 grid-cols-4">
          {mode === 'scientific' && (
              <>
                <Button variant="secondary" onClick={() => handlePress('sin(')} className="h-auto text-xs p-0">sin</Button>
                <Button variant="secondary" onClick={() => handlePress('cos(')} className="h-auto text-xs p-0">cos</Button>
                <Button variant="secondary" onClick={() => handlePress('tan(')} className="h-auto text-xs p-0">tan</Button>
                <Button variant="secondary" onClick={() => handlePress('pi')} className="h-auto text-xs p-0"><PiIcon className="w-3 h-3" /></Button>
                
                <Button variant="secondary" onClick={() => handlePress('log(')} className="h-auto text-xs p-0">log</Button>
                <Button variant="secondary" onClick={() => handlePress('ln(')} className="h-auto text-xs p-0">ln</Button>
                <Button variant="secondary" onClick={() => handlePress('sqrt(')} className="h-auto text-xs p-0">√</Button>
                <Button variant="secondary" onClick={() => handlePress('^')} className="h-auto text-xs p-0">^</Button>
                
                <Button variant="secondary" onClick={() => handlePress('(')} className="h-auto text-xs p-0">(</Button>
                <Button variant="secondary" onClick={() => handlePress(')')} className="h-auto text-xs p-0">)</Button>
              </>
          )}

          {['7', '8', '9', '/'].map((btn) => (
            <Button key={btn} variant="ghost" onClick={() => handlePress(btn)} className="h-auto text-lg">{btn}</Button>
          ))}
          {['4', '5', '6', '*'].map((btn) => (
            <Button key={btn} variant="ghost" onClick={() => handlePress(btn)} className="h-auto text-lg">{btn}</Button>
          ))}
          {['1', '2', '3', '-'].map((btn) => (
            <Button key={btn} variant="ghost" onClick={() => handlePress(btn)} className="h-auto text-lg">{btn}</Button>
          ))}
          {['C', '0', '=', '+'].map((btn) => (
            <Button key={btn} variant={btn === '=' ? 'default' : 'ghost'} onClick={() => handlePress(btn)} className="h-auto text-lg">{btn}</Button>
          ))}
        </div>
      )}
    </div>
  )
}
