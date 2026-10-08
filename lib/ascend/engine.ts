/**
 * MOCK ENGINE
 * Pure functions standing in for the future adaptive assessment + signal services.
 * Swap these implementations for API calls without touching UI components.
 */
import {
  CALIBRATION_LENGTH,
  CHALLENGE_DIMENSION_LABELS,
  DOMAIN_LABELS,
  DOMAIN_ROTATION,
  QUESTION_BANK,
} from './mock-data'
import type {
  CalibrationAnswer,
  CalibrationQuestion,
  Challenge,
  ChallengeDimension,
  ChallengeSignal,
  Difficulty,
  Domain,
  DomainSignal,
  EducationProfile,
} from './types'

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

export function startingDifficulty(profile: EducationProfile): Difficulty {
  let level = 2
  if (profile.level === 'undergraduate') level += 1
  if (profile.level === 'graduate') level += 1
  const technical = profile.fields.filter((f) =>
    ['mathematics', 'computer-science', 'programming', 'physics'].includes(f),
  ).length
  if (technical >= 2) level += 1
  return clamp(level, 1, 4) as Difficulty
}

export function adjustDifficulty(current: Difficulty, correct: boolean): Difficulty {
  return clamp(current + (correct ? 1 : -1), 1, 5) as Difficulty
}

export function nextQuestion(
  index: number,
  difficulty: Difficulty,
  askedIds: string[],
): CalibrationQuestion | null {
  if (index >= CALIBRATION_LENGTH) return null
  const domain = DOMAIN_ROTATION[index % DOMAIN_ROTATION.length]
  const candidates = QUESTION_BANK.filter((q) => q.domain === domain && !askedIds.includes(q.id))
  if (candidates.length === 0) return null
  return candidates.reduce((best, q) =>
    Math.abs(q.difficulty - difficulty) < Math.abs(best.difficulty - difficulty) ? q : best,
  )
}

export function estimateDomainSignals(answers: CalibrationAnswer[]): DomainSignal[] {
  return (Object.keys(DOMAIN_LABELS) as Domain[]).map((domain) => {
    const samples = answers.filter((a) => a.domain === domain)
    if (samples.length === 0) return { domain, label: DOMAIN_LABELS[domain], band: 3, samples: 0 }
    const evidence =
      samples.reduce((sum, a) => sum + (a.correct ? a.difficulty : a.difficulty - 1.5), 0) / samples.length
    return {
      domain,
      label: DOMAIN_LABELS[domain],
      band: clamp(Math.round(evidence * 2), 1, 9),
      samples: samples.length,
    }
  })
}

export function analyzeChallenge(challenge: Challenge, choices: Record<string, string>): ChallengeSignal[] {
  const totals: Record<ChallengeDimension, number> = { strategic: 0, prioritization: 0, risk: 0 }
  for (const step of challenge.steps) {
    const option = step.options.find((o) => o.id === choices[step.id])
    if (!option) continue
    for (const [dim, weight] of Object.entries(option.weights)) {
      totals[dim as ChallengeDimension] += weight ?? 0
    }
  }
  return (Object.keys(totals) as ChallengeDimension[]).map((dimension) => ({
    dimension,
    label: CHALLENGE_DIMENSION_LABELS[dimension],
    trend: totals[dimension] >= 2 ? 'up' : 'steady',
  }))
}
