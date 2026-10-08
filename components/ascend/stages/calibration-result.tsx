'use client'

import type { CSSProperties } from 'react'
import { useJourney } from '../journey-provider'
import { AscendButton, DisplayTitle, Frame, SegmentBar, StageShell, SystemLabel } from '../ui/primitives'

export function CalibrationResultStage() {
  const { state, dispatch } = useJourney()
  const correct = state.calibrationAnswers.filter((a) => a.correct).length

  return (
    <StageShell>
      <div className="w-full max-w-2xl">
        <SystemLabel tone="crimson" className="rise-in">
          Calibration complete
        </SystemLabel>
        <DisplayTitle className="rise-in mt-4 text-2xl sm:text-4xl" as="h1">
          Initial Signal
        </DisplayTitle>
        <p className="rise-in mt-4 max-w-lg leading-relaxed text-muted-foreground" style={{ '--delay': '0.1s' } as CSSProperties}>
          An estimated starting band based on {state.calibrationAnswers.length} adaptive responses. This is early
          evidence — it will shift as you build more.
        </p>

        <Frame className="rise-in mt-10 p-5 sm:p-8" style={{ '--delay': '0.2s' } as CSSProperties}>
          <div className="flex items-center justify-between border-b border-border pb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Estimated starting band</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-crimson">Not a verdict</p>
          </div>

          <ul className="mt-6 flex flex-col gap-7">
            {state.domainSignals.map((s, i) => (
              <li key={s.domain}>
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground">{s.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {s.samples} sample{s.samples === 1 ? '' : 's'}
                  </span>
                </div>
                <SegmentBar value={s.band} delay={0.4 + i * 0.3} />
              </li>
            ))}
          </ul>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-5 font-mono text-[10px] uppercase tracking-[0.25em]">
            <div>
              <dt className="text-muted-foreground">Responses</dt>
              <dd className="mt-1.5 text-sm text-foreground">{state.calibrationAnswers.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Aligned</dt>
              <dd className="mt-1.5 text-sm text-foreground">{correct}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Confidence</dt>
              <dd className="mt-1.5 text-sm text-crimson">Low</dd>
            </div>
          </dl>
        </Frame>

        <div className="rise-in mt-8 flex justify-end" style={{ '--delay': '1.4s' } as CSSProperties}>
          <AscendButton onClick={() => dispatch({ type: 'goto', stage: 'grid-generation' })}>
            Initial Grid Generation
          </AscendButton>
        </div>
      </div>
    </StageShell>
  )
}
