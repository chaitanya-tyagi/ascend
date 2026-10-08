'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { analyzeChallenge } from '@/lib/ascend/engine'
import { FIRST_CHALLENGE } from '@/lib/ascend/mock-data'
import { cn } from '@/lib/utils'
import { useJourney } from '../journey-provider'
import { AscendButton, DisplayTitle, Frame, StageShell, SystemLabel } from '../ui/primitives'

type Phase = 'intro' | 'step' | 'analyzing'

export function ChallengeStage() {
  const { dispatch } = useJourney()
  const challenge = FIRST_CHALLENGE
  const [phase, setPhase] = useState<Phase>('intro')
  const [stepIndex, setStepIndex] = useState(0)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (phase !== 'analyzing') return
    const t = setTimeout(() => {
      dispatch({ type: 'completeChallenge', choices, signals: analyzeChallenge(challenge, choices) })
    }, 2600)
    return () => clearTimeout(t)
  }, [phase, choices, challenge, dispatch])

  if (phase === 'intro') {
    return (
      <StageShell>
        <div className="w-full max-w-2xl text-center">
          <SystemLabel tone="crimson" className="flicker-in">
            Challenge node detected
          </SystemLabel>
          <p className="flicker-in mt-8 font-mono text-xs uppercase tracking-[0.5em] text-muted-foreground" style={{ '--delay': '0.5s' } as CSSProperties}>
            {challenge.code}
          </p>
          <div className="rise-in" style={{ '--delay': '0.7s' } as CSSProperties}>
            <DisplayTitle className="mt-4 text-3xl text-glow sm:text-5xl">{challenge.title}</DisplayTitle>
          </div>
          <p className="rise-in mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-foreground/85" style={{ '--delay': '0.9s' } as CSSProperties}>
            {challenge.brief}
          </p>
          <div className="rise-in mt-6 flex flex-wrap justify-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground" style={{ '--delay': '1.2s' } as CSSProperties}>
            <span>{challenge.steps.length} decisions</span>
            <span>No correct answer</span>
            <span>Reasoning observed</span>
          </div>
          <div className="rise-in mt-12" style={{ '--delay': '1.5s' } as CSSProperties}>
            <AscendButton onClick={() => setPhase('step')}>Begin Challenge</AscendButton>
          </div>
        </div>
      </StageShell>
    )
  }

  if (phase === 'analyzing') {
    return (
      <StageShell>
        <div className="flex flex-col items-center text-center" aria-live="polite">
          <div aria-hidden className="relative h-24 w-24">
            <span className="absolute inset-0 rounded-full border border-crimson/60" style={{ animation: 'pulse-ring 1.6s ease-out infinite' }} />
            <span className="absolute inset-0 rounded-full border border-crimson/60" style={{ animation: 'pulse-ring 1.6s ease-out 0.8s infinite' }} />
            <span className="absolute inset-[38%] rotate-45 bg-crimson shadow-[0_0_24px_var(--crimson)]" />
          </div>
          <p className="caret mt-10 font-display text-lg uppercase tracking-[0.35em] text-foreground">Analyzing signal</p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {Object.keys(choices).length} decisions recorded
          </p>
        </div>
      </StageShell>
    )
  }

  const step = challenge.steps[stepIndex]
  const isLast = stepIndex === challenge.steps.length - 1

  const confirm = () => {
    if (!pending) return
    const next = { ...choices, [step.id]: pending }
    setChoices(next)
    setPending(null)
    if (isLast) setPhase('analyzing')
    else setStepIndex((i) => i + 1)
  }

  return (
    <StageShell>
      <div className="w-full max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SystemLabel tone="crimson">{`${challenge.code} · ${challenge.title}`}</SystemLabel>
          <ol className="flex gap-1.5" aria-label="Challenge progress">
            {challenge.steps.map((s, i) => (
              <li
                key={s.id}
                aria-current={i === stepIndex ? 'step' : undefined}
                className={cn('h-1 w-10', i < stepIndex ? 'bg-crimson' : i === stepIndex ? 'bg-foreground' : 'bg-steel/40')}
              >
                <span className="sr-only">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <Frame key={step.id} className="rise-in mt-6 p-5 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {`Decision ${String(stepIndex + 1).padStart(2, '0')} — ${step.title}`}
          </p>
          <h2 className="mt-4 text-pretty text-lg leading-relaxed text-foreground sm:text-xl">{step.situation}</h2>

          <div role="radiogroup" aria-label="Options" className="mt-8 flex flex-col gap-2">
            {step.options.map((opt) => {
              const active = pending === opt.id
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPending(opt.id)}
                  className={cn(
                    'flex min-h-16 flex-col items-start gap-1 border px-4 py-3 text-left transition-all duration-200',
                    active ? 'border-crimson bg-crimson/10 shadow-[0_0_28px_-14px_var(--crimson)]' : 'border-border bg-obsidian/40 hover:border-steel',
                  )}
                >
                  <span className="text-base text-foreground">{opt.label}</span>
                  <span className="font-mono text-[11px] tracking-wide text-muted-foreground">{opt.detail}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
              {pending ? 'Ready to commit' : 'Select a course of action'}
            </p>
            <AscendButton disabled={!pending} onClick={confirm}>
              {isLast ? 'Commit Final Decision' : 'Commit Decision'}
            </AscendButton>
          </div>
        </Frame>
      </div>
    </StageShell>
  )
}
