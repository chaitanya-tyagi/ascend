'use client'

import Image from 'next/image'
import { useEffect, type CSSProperties } from 'react'
import { useJourney } from '../journey-provider'
import { Avatar } from '../world/avatar'
import { AscendButton } from '../ui/primitives'

const LINES = [
  { text: 'Grid initialized', delay: 4.2 },
  { text: 'User profile synchronized', delay: 5 },
]

export function GridEntryStage() {
  const { dispatch } = useJourney()
  const enter = () => dispatch({ type: 'goto', stage: 'grid' })

  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'goto', stage: 'grid' }), 11000)
    return () => clearTimeout(t)
  }, [dispatch])

  return (
    <main className="fixed inset-0 overflow-hidden bg-obsidian" aria-label="Entering the Grid">
      {/* City forms around the user — camera pushes forward */}
      <div
        aria-hidden
        className="fade-in-slow absolute inset-0"
        style={{ '--delay': '2.2s', '--dur': '3s' } as CSSProperties}
      >
        <div className="absolute inset-0 origin-[50%_60%] animate-[camera-push_9s_cubic-bezier(0.22,1,0.36,1)_forwards]">
          <Image src="/images/grid-skyline.png" alt="" fill priority sizes="100vw" className="object-cover object-[center_35%] opacity-75" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_10%,rgba(5,6,8,0.6)_55%,#050608_100%)]" />
      </div>

      {/* Perspective floor + road */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[52%] [perspective:500px]">
        <div
          className="absolute inset-x-[-50%] bottom-0 top-0 origin-bottom opacity-0 [transform:rotateX(68deg)]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(58,63,72,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(58,63,72,0.35) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            animation: 'fade-in 1.6s ease-out 1.2s forwards, floor-scroll 1.2s linear infinite',
            maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          } as CSSProperties}
        />
        {/* The crimson line expands into a road */}
        <div className="absolute bottom-0 left-1/2 top-0 w-[30%] -translate-x-1/2 [perspective:500px]">
          <div className="absolute inset-0 origin-bottom [transform:rotateX(68deg)]">
            <div className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 origin-bottom animate-[road-line_1.2s_cubic-bezier(0.65,0,0.35,1)_0.4s_both] bg-crimson shadow-[0_0_18px_var(--crimson)]" />
            <div
              className="absolute inset-y-0 left-1/2 -translate-x-1/2 animate-[road-widen_1.4s_cubic-bezier(0.65,0,0.35,1)_1.5s_both] border-x border-crimson/60 bg-gradient-to-t from-crimson/15 to-transparent"
              style={{ maskImage: 'linear-gradient(to top, black 40%, transparent 100%)' }}
            />
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="rise-in absolute bottom-[14%] left-1/2 -translate-x-1/2"
        style={{ '--delay': '3.4s' } as CSSProperties}
      >
        <Avatar size={128} />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-start px-6 pt-[16vh] text-center">
        <ul aria-live="polite" className="flex flex-col items-center gap-2 font-mono text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
          {LINES.map((l) => (
            <li key={l.text} className="flicker-in" style={{ '--delay': `${l.delay}s` } as CSSProperties}>
              {l.text}
            </li>
          ))}
        </ul>
        <p
          className="flicker-in mt-6 font-display text-2xl uppercase tracking-[0.3em] text-foreground text-glow sm:text-4xl"
          style={{ '--delay': '6s' } as CSSProperties}
        >
          Welcome to Ascend
        </p>
        <div className="rise-in mt-10" style={{ '--delay': '7s' } as CSSProperties}>
          <AscendButton onClick={enter}>Take Control</AscendButton>
        </div>
      </div>

      <button
        type="button"
        onClick={enter}
        className="absolute bottom-5 right-5 z-20 min-h-11 px-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70 hover:text-foreground"
      >
        Skip
      </button>
    </main>
  )
}
