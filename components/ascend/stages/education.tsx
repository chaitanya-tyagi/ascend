'use client'

import { useState, type CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { EDUCATION_FIELDS, STUDY_LEVELS } from '@/lib/ascend/mock-data'
import type { StudyLevel } from '@/lib/ascend/types'
import { cn } from '@/lib/utils'
import { useJourney } from '../journey-provider'
import { AscendButton, DisplayTitle, Frame, StageShell, SystemLabel } from '../ui/primitives'

export function EducationStage() {
  const { state, dispatch } = useJourney()
  const [fields, setFields] = useState<string[]>(state.education.fields)
  const [level, setLevel] = useState<StudyLevel | null>(state.education.level)

  const toggle = (id: string) => setFields((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  const ready = fields.length > 0 && level !== null

  return (
    <StageShell>
      <div className="w-full max-w-3xl">
        <div className="rise-in flex flex-wrap items-center justify-between gap-3">
          <SystemLabel tone="crimson">{'Education Profile // 01'}</SystemLabel>
          <span className="border border-steel/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Self-reported information
          </span>
        </div>
        <DisplayTitle className="rise-in mt-5 text-2xl sm:text-4xl" as="h1">
          {"Tell ASCEND what you've already studied."}
        </DisplayTitle>
        <p className="rise-in mt-4 max-w-xl leading-relaxed text-muted-foreground" style={{ '--delay': '0.1s' } as CSSProperties}>
          Your answers help determine your starting point. Nothing here is treated as verified — the calibration that
          follows will gather early evidence.
        </p>

        <Frame className="rise-in mt-10 p-5 sm:p-7" style={{ '--delay': '0.2s' } as CSSProperties}>
          <fieldset>
            <legend className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Fields of study — select all that apply
            </legend>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {EDUCATION_FIELDS.map((f) => {
                const active = fields.includes(f.id)
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(f.id)}
                    className={cn(
                      'group relative flex min-h-16 flex-col items-start justify-between gap-2 border p-3 text-left transition-all duration-200',
                      active
                        ? 'border-crimson/70 bg-crimson/10 shadow-[0_0_24px_-12px_var(--crimson)]'
                        : 'border-border bg-obsidian/40 hover:border-steel',
                    )}
                  >
                    <span className={cn('font-mono text-[10px] tracking-[0.3em]', active ? 'text-crimson' : 'text-muted-foreground/70')}>
                      {f.code}
                    </span>
                    <span className="text-sm text-foreground">{f.label}</span>
                    {active && <Check aria-hidden className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-crimson" />}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Highest level of study
            </legend>
            <div role="radiogroup" className="mt-5 flex flex-wrap gap-2">
              {STUDY_LEVELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  role="radio"
                  aria-checked={level === l.id}
                  onClick={() => setLevel(l.id)}
                  className={cn(
                    'min-h-11 border px-4 text-sm transition-colors',
                    level === l.id
                      ? 'border-crimson/70 bg-crimson/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-steel hover:text-foreground',
                  )}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </fieldset>
        </Frame>

        <div className="rise-in mt-8 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center" style={{ '--delay': '0.3s' } as CSSProperties}>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
            {ready ? `${fields.length} field${fields.length > 1 ? 's' : ''} logged` : 'Awaiting input'}
          </p>
          <AscendButton
            disabled={!ready}
            onClick={() => level && dispatch({ type: 'setEducation', education: { fields, level, notes: '' } })}
          >
            Continue to Calibration
          </AscendButton>
        </div>
      </div>
    </StageShell>
  )
}
