'use client'

import type { CSSProperties } from 'react'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { useJourney } from '../journey-provider'
import { AscendButton, DisplayTitle, Frame, StageShell, SystemLabel } from '../ui/primitives'

export function SignalStage() {
  const { state, dispatch } = useJourney()

  return (
    <StageShell>
      <div className="w-full max-w-xl">
        <SystemLabel tone="crimson" className="flicker-in">
          Challenge // 001 complete
        </SystemLabel>
        <DisplayTitle className="flicker-in mt-4 text-3xl text-glow sm:text-4xl" as="h1">
          Signal Detected
        </DisplayTitle>

        <Frame className="rise-in mt-10 p-5 sm:p-7" style={{ '--delay': '0.4s' } as CSSProperties}>
          <ul className="flex flex-col divide-y divide-border">
            {state.challengeSignals.map((s, i) => (
              <li
                key={s.dimension}
                className="rise-in flex items-center justify-between gap-4 py-4"
                style={{ '--delay': `${0.7 + i * 0.25}s` } as CSSProperties}
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-foreground">{s.label}</span>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
                  {s.trend === 'up' ? (
                    <>
                      <ArrowUp aria-hidden className="h-4 w-4 text-crimson" />
                      <span className="text-crimson">Emerging</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight aria-hidden className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Steady</span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.25em]">
            <div>
              <dt className="text-muted-foreground">Signal strength</dt>
              <dd className="mt-1.5 text-sm text-foreground">Early</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Confidence</dt>
              <dd className="mt-1.5 text-sm text-crimson">Low</dd>
            </div>
          </dl>
          <p className="mt-5 border-l-2 border-crimson/60 pl-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Repeated evidence required
          </p>
        </Frame>

        <p
          className="rise-in mt-10 text-center font-display text-sm uppercase tracking-[0.3em] text-foreground/90"
          style={{ '--delay': '1.8s' } as CSSProperties}
        >
          One decision is never a verdict.
        </p>

        <div className="rise-in mt-10 flex justify-center" style={{ '--delay': '2.2s' } as CSSProperties}>
          <AscendButton onClick={() => dispatch({ type: 'goto', stage: 'grid' })}>Proceed to Ascend Core</AscendButton>
        </div>
      </div>
    </StageShell>
  )
}
