'use client'

import { useCallback, useEffect } from 'react'
import { JourneyProvider, useJourney } from './journey-provider'
import { AuthStage } from './stages/auth'
import { CalibrationStage } from './stages/calibration'
import { CalibrationResultStage } from './stages/calibration-result'
import { ChallengeStage } from './stages/challenge'
import { CoreStage } from './stages/core'
import { EducationStage } from './stages/education'
import { GridEntryStage } from './stages/grid-entry'
import { GridWorldStage } from './stages/grid-world'
import { LandingStage } from './stages/landing'
import { SignalStage } from './stages/signal'
import { SystemSequence } from './stages/system-sequence'
import { Backdrop } from './ui/backdrop'

export function AscendApp() {
  return (
    <JourneyProvider>
      <StageRouter />
    </JourneyProvider>
  )
}

function StageRouter() {
  const { state, dispatch } = useJourney()
  const toEducation = useCallback(() => dispatch({ type: 'goto', stage: 'education' }), [dispatch])
  const toGridEntry = useCallback(() => dispatch({ type: 'goto', stage: 'grid-entry' }), [dispatch])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [state.stage])

  switch (state.stage) {
    case 'landing':
      return <LandingStage />
    case 'grid-entry':
      return <GridEntryStage />
    case 'grid':
      return <GridWorldStage />
  }

  const backdrop =
    state.stage === 'challenge' || state.stage === 'signal'
      ? { image: '/images/arena.png', intensity: 0.4 }
      : state.stage === 'core'
        ? { image: '/images/core-interior.png', intensity: 0.5 }
        : { image: '/images/grid-skyline.png', intensity: 0.22 }

  return (
    <>
      <Backdrop {...backdrop} />
      <div key={state.stage} className="relative z-10">
        {state.stage === 'auth' && <AuthStage />}
        {state.stage === 'profile-init' && (
          <SystemSequence
            eyebrow="System"
            title="Initializing user profile"
            lines={['Identity accepted', 'Allocating profile container', 'Linking session', 'Preparing education intake']}
            onComplete={toEducation}
          />
        )}
        {state.stage === 'education' && <EducationStage />}
        {state.stage === 'calibration' && <CalibrationStage />}
        {state.stage === 'calibration-result' && <CalibrationResultStage />}
        {state.stage === 'grid-generation' && (
          <SystemSequence
            eyebrow="Initial Grid Generation"
            title="Constructing your Grid"
            lines={[
              'Mapping starting band',
              'Generating Grid City — Sector 01',
              'Routing Central Spine',
              'Placing Calibration Arena',
              'Sealing Ascend Core',
              'Restricting advanced sectors',
            ]}
            interval={480}
            onComplete={toGridEntry}
          />
        )}
        {state.stage === 'challenge' && <ChallengeStage />}
        {state.stage === 'signal' && <SignalStage />}
        {state.stage === 'core' && <CoreStage />}
      </div>
    </>
  )
}
