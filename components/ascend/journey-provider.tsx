'use client'

import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import type {
  CalibrationAnswer,
  ChallengeSignal,
  DomainSignal,
  EducationProfile,
  Stage,
  UserIdentity,
  WorldNodeId,
} from '@/lib/ascend/types'

/**
 * Client-only journey state for the prototype.
 * Each slice maps to a future backend resource (session, profile, assessment, evidence).
 */
export interface JourneyState {
  stage: Stage
  user: UserIdentity | null
  education: EducationProfile
  calibrationAnswers: CalibrationAnswer[]
  domainSignals: DomainSignal[]
  challengeChoices: Record<string, string>
  challengeSignals: ChallengeSignal[]
  avatarNode: WorldNodeId
  challengeComplete: boolean
  coreVisited: boolean
}

type Action =
  | { type: 'goto'; stage: Stage }
  | { type: 'signIn'; user: UserIdentity }
  | { type: 'setEducation'; education: EducationProfile }
  | { type: 'completeCalibration'; answers: CalibrationAnswer[]; signals: DomainSignal[] }
  | { type: 'completeChallenge'; choices: Record<string, string>; signals: ChallengeSignal[] }
  | { type: 'setAvatarNode'; node: WorldNodeId }
  | { type: 'visitCore' }

const initialState: JourneyState = {
  stage: 'landing',
  user: null,
  education: { fields: [], level: null, notes: '' },
  calibrationAnswers: [],
  domainSignals: [],
  challengeChoices: {},
  challengeSignals: [],
  avatarNode: 'entry',
  challengeComplete: false,
  coreVisited: false,
}

function reducer(state: JourneyState, action: Action): JourneyState {
  switch (action.type) {
    case 'goto':
      return { ...state, stage: action.stage }
    case 'signIn':
      return { ...state, user: action.user, stage: 'profile-init' }
    case 'setEducation':
      return { ...state, education: action.education, stage: 'calibration' }
    case 'completeCalibration':
      return {
        ...state,
        calibrationAnswers: action.answers,
        domainSignals: action.signals,
        stage: 'calibration-result',
      }
    case 'completeChallenge':
      return {
        ...state,
        challengeChoices: action.choices,
        challengeSignals: action.signals,
        challengeComplete: true,
        stage: 'signal',
      }
    case 'setAvatarNode':
      return { ...state, avatarNode: action.node }
    case 'visitCore':
      return { ...state, coreVisited: true, avatarNode: 'core', stage: 'core' }
    default:
      return state
  }
}

const JourneyContext = createContext<{ state: JourneyState; dispatch: React.Dispatch<Action> } | null>(null)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  const ctx = useContext(JourneyContext)
  if (!ctx) throw new Error('useJourney must be used within JourneyProvider')
  return ctx
}
