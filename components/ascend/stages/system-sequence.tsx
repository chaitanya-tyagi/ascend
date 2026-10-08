'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { DisplayTitle, StageShell, SystemLabel } from '../ui/primitives'

interface SystemSequenceProps {
  eyebrow: string
  title: string
  lines: string[]
  /** ms between lines */
  interval?: number
  onComplete: () => void
}

/** Terminal-style boot sequence used between major journey stages. */
export function SystemSequence({ eyebrow, title, lines, interval = 520, onComplete }: SystemSequenceProps) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    if (visible < lines.length) {
      const t = setTimeout(() => setVisible((v) => v + 1), interval)
      return () => clearTimeout(t)
    }
    const done = setTimeout(onComplete, 900)
    return () => clearTimeout(done)
  }, [visible, lines.length, interval, onComplete])

  const progress = Math.round((visible / lines.length) * 100)

  return (
    <StageShell>
      <div className="w-full max-w-lg">
        <SystemLabel tone="crimson" className="rise-in">
          {eyebrow}
        </SystemLabel>
        <DisplayTitle className="rise-in caret mt-4 text-xl sm:text-2xl">{title}</DisplayTitle>

        <div className="mt-10 h-px w-full bg-steel/30">
          <div
            className="h-px bg-crimson shadow-[0_0_12px_var(--crimson)] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span>Progress</span>
          <span>{progress.toString().padStart(3, '0')}%</span>
        </div>

        <ul aria-live="polite" className="mt-8 flex flex-col gap-2.5 font-mono text-xs uppercase tracking-[0.18em]">
          {lines.slice(0, visible).map((line, i) => (
            <li key={line} className={cn('rise-in flex gap-4', i === visible - 1 ? 'text-foreground' : 'text-muted-foreground')}>
              <span className="text-crimson/80">{String(i + 1).padStart(2, '0')}</span>
              <span>{line}</span>
              <span className="ml-auto text-muted-foreground/60">OK</span>
            </li>
          ))}
        </ul>
      </div>
    </StageShell>
  )
}
