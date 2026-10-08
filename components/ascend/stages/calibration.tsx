'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { adjustDifficulty, estimateDomainSignals, nextQuestion, startingDifficulty } from '@/lib/ascend/engine'
import { CALIBRATION_LENGTH, DOMAIN_LABELS } from '@/lib/ascend/mock-data'
import type { CalibrationAnswer, Difficulty } from '@/lib/ascend/types'
import { cn } from '@/lib/utils'
import { useJourney } from '../journey-provider'
import { AscendButton, Frame, StageShell, SystemLabel } from '../ui/primitives'

type Feedback = { correct: boolean; from: Difficulty; to: Difficulty } | null

export function CalibrationStage() {
  const { state, dispatch } = useJourney()
  const initial = useMemo(() => startingDifficulty(state.education), [state.education])
  const [difficulty, setDifficulty] = useState<Difficulty>(initial)
  const [answers, setAnswers] = useState<CalibrationAnswer[]>([])
  const [history, setHistory] = useState<Difficulty[]>([initial])
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const index = answers.length
  const question = useMemo(
    () => nextQuestion(index, difficulty, answers.map((a) => a.questionId)),
    // question is locked in until the answer is recorded
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [index],
  )

  if (!question) return null

  const submit = (optionIndex: number) => {
    if (feedback) return
    setSelected(optionIndex)
    const correct = optionIndex === question.answerIndex
    const next = adjustDifficulty(difficulty, correct)
    setFeedback({ correct, from: difficulty, to: next })
  }

  const advance = () => {
    if (!feedback || selected === null) return
    const answer: CalibrationAnswer = {
      questionId: question.id,
      domain: question.domain,
      difficulty: question.difficulty,
      correct: feedback.correct,
    }
    const all = [...answers, answer]
    if (all.length >= CALIBRATION_LENGTH) {
      dispatch({ type: 'completeCalibration', answers: all, signals: estimateDomainSignals(all) })
      return
    }
    setDifficulty(feedback.to)
    setHistory((h) => [...h, feedback.to])
    setAnswers(all)
    setSelected(null)
    setFeedback(null)
  }

  const direction = feedback ? (feedback.to > feedback.from ? 'up' : feedback.to < feedback.from ? 'down' : 'hold') : null

  return (
    <StageShell>
      <div className="w-full max-w-3xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SystemLabel tone="crimson">{`Calibration // ${String(index + 1).padStart(2, '0')}`}</SystemLabel>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {DOMAIN_LABELS[question.domain]} · {index + 1} of {CALIBRATION_LENGTH}
            </p>
          </div>
          <DifficultyTrace history={history} pending={feedback?.to ?? null} />
        </div>

        <Frame key={question.id} className="rise-in mt-6 p-5 sm:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Question</p>
          <h2 className="mt-3 text-pretty text-xl leading-relaxed text-foreground sm:text-2xl">{question.prompt}</h2>
          {question.code && (
            <pre className="mt-5 overflow-x-auto border-l-2 border-crimson/60 bg-obsidian/70 px-4 py-3 font-mono text-sm leading-relaxed text-foreground/90">
              <code>{question.code}</code>
            </pre>
          )}

          <div className="mt-8 grid gap-2 sm:grid-cols-2" role="group" aria-label="Answer options">
            {question.options.map((opt, i) => {
              const isSelected = selected === i
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={!!feedback}
                  onClick={() => submit(i)}
                  className={cn(
                    'group flex min-h-14 items-center gap-4 border px-4 text-left transition-all duration-200',
                    isSelected
                      ? 'border-crimson bg-crimson/10'
                      : 'border-border bg-obsidian/40 hover:border-steel hover:bg-gunmetal/30',
                    feedback && !isSelected && 'opacity-40',
                  )}
                >
                  <span className={cn('font-mono text-[11px] tracking-[0.2em]', isSelected ? 'text-crimson' : 'text-muted-foreground')}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-base text-foreground">{opt}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-8 flex min-h-12 flex-col items-start justify-between gap-4 border-t border-border pt-5 sm:flex-row sm:items-center" aria-live="polite">
            {feedback ? (
              <div className="rise-in">
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground">Decision recorded</p>
                <p className="mt-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-crimson">
                  {direction === 'up' && <ArrowUp aria-hidden className="h-3.5 w-3.5" />}
                  {direction === 'down' && <ArrowDown aria-hidden className="h-3.5 w-3.5" />}
                  {direction === 'hold' && <Minus aria-hidden className="h-3.5 w-3.5" />}
                  {direction === 'up' && 'Difficulty adjusted ↑'}
                  {direction === 'down' && 'Difficulty adjusted ↓'}
                  {direction === 'hold' && 'Difficulty held — boundary reached'}
                </p>
              </div>
            ) : (
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                Difficulty adapts to every response
              </p>
            )}
            <AscendButton disabled={!feedback} onClick={advance}>
              {index + 1 >= CALIBRATION_LENGTH ? 'Complete Calibration' : 'Next'}
            </AscendButton>
          </div>
        </Frame>

        <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60">
          Prototype calibration — results are illustrative, not scientific
        </p>
      </div>
    </StageShell>
  )
}

function DifficultyTrace({ history, pending }: { history: Difficulty[]; pending: Difficulty | null }) {
  const trace = pending ? [...history, pending] : history
  const w = 160
  const h = 40
  const step = w / (CALIBRATION_LENGTH)
  const y = (d: number) => h - ((d - 1) / 4) * (h - 6) - 3
  const points = trace.map((d, i) => `${i * step + 3},${y(d)}`).join(' ')
  const current = trace[trace.length - 1]

  return (
    <div className="flex items-end gap-4">
      <div className="text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Difficulty</p>
        <p className="mt-1 font-display text-lg text-foreground">
          {String(current).padStart(2, '0')}
          <span className="text-muted-foreground">/05</span>
        </p>
      </div>
      <svg width={w + 6} height={h} aria-hidden className="overflow-visible">
        {[1, 2, 3, 4, 5].map((d) => (
          <line key={d} x1="0" x2={w + 6} y1={y(d)} y2={y(d)} stroke="#23262d" strokeWidth="1" />
        ))}
        <polyline points={points} fill="none" stroke="#e3173a" strokeWidth="1.5" />
        {trace.map((d, i) => (
          <circle
            key={i}
            cx={i * step + 3}
            cy={y(d)}
            r={i === trace.length - 1 ? 3 : 2}
            fill={i === trace.length - 1 ? '#e3173a' : '#8a8f99'}
            className="rise-in"
            style={{ '--delay': '0s' } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  )
}
