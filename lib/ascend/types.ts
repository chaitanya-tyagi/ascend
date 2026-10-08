export type Stage =
  | 'landing'
  | 'auth'
  | 'profile-init'
  | 'education'
  | 'calibration'
  | 'calibration-result'
  | 'grid-generation'
  | 'grid-entry'
  | 'grid'
  | 'challenge'
  | 'signal'
  | 'core'

export interface UserIdentity {
  name: string
  email: string
}

export type StudyLevel = 'secondary' | 'self-taught' | 'undergraduate' | 'graduate'

export interface EducationProfile {
  fields: string[]
  level: StudyLevel | null
  notes: string
}

export type Domain = 'mathematics' | 'programming' | 'reasoning'

/** 1 (foundational) → 5 (advanced) */
export type Difficulty = 1 | 2 | 3 | 4 | 5

export interface CalibrationQuestion {
  id: string
  domain: Domain
  difficulty: Difficulty
  prompt: string
  code?: string
  options: string[]
  answerIndex: number
}

export interface CalibrationAnswer {
  questionId: string
  domain: Domain
  difficulty: Difficulty
  correct: boolean
}

export interface DomainSignal {
  domain: Domain
  label: string
  /** 0–10 estimated band, never a verdict */
  band: number
  samples: number
}

export type SignalTrend = 'up' | 'steady'

export interface ChallengeOption {
  id: string
  label: string
  detail: string
  weights: Partial<Record<ChallengeDimension, number>>
}

export type ChallengeDimension = 'strategic' | 'prioritization' | 'risk'

export interface ChallengeStep {
  id: string
  title: string
  situation: string
  options: ChallengeOption[]
}

export interface Challenge {
  id: string
  code: string
  title: string
  brief: string
  steps: ChallengeStep[]
}

export interface ChallengeSignal {
  dimension: ChallengeDimension
  label: string
  trend: SignalTrend
}

export type WorldNodeId =
  | 'entry'
  | 'city'
  | 'spine'
  | 'arena'
  | 'core'
  | 'sector03'
  | 'advanced-arena'
  | 'deep-grid'

export interface WorldNode {
  id: WorldNodeId
  label: string
  sublabel: string
  /** isometric grid coordinates */
  x: number
  y: number
  neighbors: WorldNodeId[]
  kind: 'waypoint' | 'challenge' | 'core' | 'locked'
  lockReason?: string
}
