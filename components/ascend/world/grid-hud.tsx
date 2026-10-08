'use client'

import { Lock } from 'lucide-react'
import type { WorldNodeId } from '@/lib/ascend/types'
import { WORLD_NODES } from '@/lib/ascend/world'
import { cn } from '@/lib/utils'
import { AscendButton } from '../ui/primitives'

export interface HudNotice {
  id: number
  title: string
  detail?: string
  tone: 'info' | 'signal' | 'locked'
}

interface GridHudProps {
  userName: string
  sector: string
  objective: WorldNodeId | null
  notices: HudNotice[]
  prompt: { title: string; detail: string; action: string } | null
  onInteract: () => void
  currentNode: WorldNodeId
  moving: boolean
  isAccessible: (id: WorldNodeId) => boolean
  onTravel: (id: WorldNodeId) => void
}

const OBJECTIVE_TEXT: Record<string, string> = {
  arena: 'Reach the Calibration Arena',
  core: 'Proceed to the Ascend Core',
}

export function GridHud({
  userName,
  sector,
  objective,
  notices,
  prompt,
  onInteract,
  currentNode,
  moving,
  isAccessible,
  onTravel,
}: GridHudProps) {
  const neighbors = WORLD_NODES[currentNode].neighbors

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6">
      {/* Top bar */}
      <header className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="font-display text-sm tracking-[0.35em] text-foreground">ASCEND</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-crimson">{'// '}</span>
            {sector}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Operator</p>
          <p className="max-w-[40vw] truncate font-mono text-xs uppercase tracking-[0.2em] text-foreground">{userName}</p>
        </div>
      </header>

      {/* Notifications */}
      <div aria-live="polite" className="absolute right-4 top-20 flex w-64 flex-col gap-2 sm:right-6 sm:top-24 sm:w-72">
        {notices.map((n) => (
          <div
            key={n.id}
            className={cn(
              'rise-in border-l-2 bg-graphite/85 px-3.5 py-2.5 backdrop-blur-md',
              n.tone === 'signal' && 'border-crimson',
              n.tone === 'info' && 'border-steel',
              n.tone === 'locked' && 'border-crimson-dim',
            )}
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground">
              {n.tone === 'locked' && <Lock aria-hidden className="h-3 w-3 text-crimson" />}
              {n.title}
            </p>
            {n.detail && <p className="mt-1 text-xs text-muted-foreground">{n.detail}</p>}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-4">
        {prompt && (
          <div className="pointer-events-auto rise-in flex flex-col items-center gap-3 border border-crimson/40 bg-graphite/85 px-6 py-4 text-center backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-crimson">{prompt.title}</p>
            <p className="text-sm text-foreground">{prompt.detail}</p>
            <AscendButton onClick={onInteract}>
              {prompt.action}
              <kbd className="hidden border border-steel/70 px-1.5 py-0.5 text-[9px] text-muted-foreground sm:inline">E</kbd>
            </AscendButton>
          </div>
        )}

        <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
          {objective ? (
            <div className="order-2 sm:order-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Objective</p>
              <p className="mt-1 text-sm text-foreground">{OBJECTIVE_TEXT[objective]}</p>
            </div>
          ) : (
            <div className="order-2 sm:order-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Objective</p>
              <p className="mt-1 text-sm text-foreground">Continue exploration</p>
            </div>
          )}

          <nav aria-label="Travel" className="pointer-events-auto order-1 flex flex-wrap justify-center gap-1.5 sm:order-2">
            {neighbors.map((id) => {
              const n = WORLD_NODES[id]
              const open = isAccessible(id)
              return (
                <button
                  key={id}
                  type="button"
                  disabled={moving}
                  onClick={() => onTravel(id)}
                  className={cn(
                    'flex min-h-10 items-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.22em] backdrop-blur-md transition-colors disabled:opacity-50',
                    open
                      ? 'border-steel/70 bg-graphite/80 text-foreground hover:border-crimson/70'
                      : 'border-border bg-obsidian/70 text-muted-foreground/70',
                    objective === id && 'border-crimson/80',
                  )}
                >
                  {!open && <Lock aria-hidden className="h-3 w-3" />}
                  {n.label}
                </button>
              )
            })}
          </nav>

          <p className="order-3 hidden font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 lg:block">
            {'Arrows / WASD — move · Click — travel · E — interact'}
          </p>
        </div>
      </div>
    </div>
  )
}
