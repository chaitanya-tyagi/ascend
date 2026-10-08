'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Lock } from 'lucide-react'
import type { Domain } from '@/lib/ascend/types'
import { useJourney } from '../journey-provider'
import { AscendButton, DisplayTitle, Frame, StageShell, SystemLabel } from '../ui/primitives'

const DOMAIN_SIGNAL_NAMES: Record<Domain, string> = {
  mathematics: 'Quantitative Analysis',
  programming: 'Computational Thinking',
  reasoning: 'Problem Solving',
}

const LOCKED_AREAS = ['Sector 03', 'Advanced Arena', 'Deep Grid']

export function CoreStage() {
  const { state, dispatch } = useJourney()

  const signals = [
    ...state.domainSignals.filter((s) => s.band >= 6).map((s) => DOMAIN_SIGNAL_NAMES[s.domain]),
    ...state.challengeSignals.filter((s) => s.trend === 'up').map((s) => s.label),
  ]
  const dataPoints = state.calibrationAnswers.length + Object.keys(state.challengeChoices).length

  return (
    <StageShell>
      <div className="w-full max-w-2xl">
        <div className="flicker-in flex items-center gap-3">
          <span aria-hidden className="h-2 w-2 rotate-45 bg-crimson shadow-[0_0_12px_var(--crimson)]" />
          <SystemLabel tone="crimson">Ascend Core</SystemLabel>
        </div>
        <DisplayTitle className="rise-in mt-4 text-3xl sm:text-4xl" as="h1">
          {'Ascend // Status'}
        </DisplayTitle>

        <Frame className="rise-in clip-corner mt-10" style={{ '--delay': '0.3s' } as CSSProperties}>
          <dl className="divide-y divide-border">
            <Row label="User" delay={0.5}>
              <span className="truncate">{state.user?.name ?? 'Operator'}</span>
            </Row>
            <Row label="Current state" delay={0.65}>
              <span className="flex items-center gap-2 text-crimson">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse bg-crimson" />
                Calibrating
              </span>
            </Row>
            <Row label="Signals detected" delay={0.8}>
              {signals.length > 0 ? (
                <ul className="flex flex-col items-end gap-1.5">
                  {signals.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">Faint — still gathering</span>
              )}
            </Row>
            <Row label="Evidence" delay={0.95}>
              <span className="flex flex-col items-end gap-1">
                <span className="text-crimson">Insufficient</span>
                <span className="text-[10px] text-muted-foreground">{dataPoints} data points recorded</span>
              </span>
            </Row>
            <Row label="Next objective" delay={1.1}>
              Continue exploration
            </Row>
          </dl>
        </Frame>

        <div className="rise-in mt-8" style={{ '--delay': '1.3s' } as CSSProperties}>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sealed regions</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {LOCKED_AREAS.map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 border border-border bg-obsidian/60 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                <Lock aria-hidden className="h-3 w-3 text-crimson/80" />
                {a}
                <span className="text-muted-foreground/60">— requires further development</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rise-in mt-12 flex justify-end" style={{ '--delay': '1.6s' } as CSSProperties}>
          <AscendButton onClick={() => dispatch({ type: 'goto', stage: 'grid' })}>Return to the Grid</AscendButton>
        </div>
      </div>
    </StageShell>
  )
}

function Row({ label, children, delay }: { label: string; children: ReactNode; delay: number }) {
  return (
    <div
      className="rise-in flex items-start justify-between gap-6 px-5 py-4 sm:px-7"
      style={{ '--delay': `${delay}s` } as CSSProperties}
    >
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-mono text-xs uppercase tracking-[0.2em] text-foreground">{children}</dd>
    </div>
  )
}
