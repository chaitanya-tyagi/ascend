'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import { useJourney } from '../journey-provider'
import { Particles } from '../ui/particles'
import { AscendButton } from '../ui/primitives'

const VP = { x: 800, y: 520 }
const FLOOR_RAYS = Array.from({ length: 21 }, (_, i) => -1600 + i * 240)
const FLOOR_ROWS = [536, 556, 584, 624, 680, 760, 880]

export function LandingStage() {
  const { dispatch } = useJourney()

  return (
    <main className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-obsidian">
      {/* City materializes after the lines construct the world */}
      <div aria-hidden className="fade-in-slow absolute inset-0" style={{ '--delay': '2.6s', '--dur': '3s' } as CSSProperties}>
        <Image
          src="/images/grid-skyline.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_40%] opacity-80"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(5,6,8,0.4)_45%,#050608_95%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-obsidian via-obsidian/85 to-transparent" />
      </div>

      <div aria-hidden className="fade-in-slow absolute inset-0" style={{ '--delay': '3.4s' } as CSSProperties}>
        <Particles />
      </div>

      {/* Energy lines constructing the environment */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="horizon" x1="0" x2="1">
            <stop offset="0" stopColor="#e3173a" stopOpacity="0" />
            <stop offset="0.5" stopColor="#e3173a" stopOpacity="1" />
            <stop offset="1" stopColor="#e3173a" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e3173a" stopOpacity="0.05" />
            <stop offset="1" stopColor="#8a8f99" stopOpacity="0.35" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <line
          x1="0"
          y1={VP.y}
          x2="1600"
          y2={VP.y}
          stroke="url(#horizon)"
          strokeWidth="1.5"
          filter="url(#glow)"
          className="draw-line"
          style={{ '--len': 1600, '--dur': '1.4s', '--delay': '0.5s' } as CSSProperties}
        />

        {FLOOR_RAYS.map((x, i) => (
          <line
            key={x}
            x1={VP.x}
            y1={VP.y}
            x2={x}
            y2={900}
            stroke="url(#ray)"
            strokeWidth="1"
            className="draw-line"
            style={{ '--len': 1700, '--dur': '1.2s', '--delay': `${1.3 + Math.abs(i - 10) * 0.06}s` } as CSSProperties}
          />
        ))}
        {FLOOR_ROWS.map((y, i) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="1600"
            y2={y}
            stroke="#3a3f48"
            strokeOpacity={0.25 + i * 0.06}
            strokeWidth="1"
            className="draw-line"
            style={{ '--len': 1600, '--dur': '1s', '--delay': `${1.8 + i * 0.1}s` } as CSSProperties}
          />
        ))}
        <line
          x1={VP.x}
          y1={VP.y}
          x2={VP.x}
          y2={900}
          stroke="#e3173a"
          strokeWidth="2"
          filter="url(#glow)"
          className="draw-line"
          style={{ '--len': 400, '--dur': '1.1s', '--delay': '1.1s' } as CSSProperties}
        />
        <circle cx={VP.x} cy={VP.y} r="3" fill="#e3173a" className="flicker-in" style={{ '--delay': '0.4s' } as CSSProperties} />
      </svg>

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p
          className="flicker-in mb-6 font-mono text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          style={{ '--delay': '3.8s' } as CSSProperties}
        >
          {'Signal // Established'}
        </p>
        <h1
          className="flicker-in font-display text-5xl uppercase tracking-[0.35em] text-foreground sm:text-7xl md:text-8xl md:tracking-[0.45em]"
          style={{ '--delay': '4.2s' } as CSSProperties}
        >
          <span className="mr-[-0.35em] md:mr-[-0.45em]">Ascend</span>
        </h1>
        <div
          aria-hidden
          className="rise-in mt-6 h-px w-40 bg-gradient-to-r from-transparent via-crimson to-transparent"
          style={{ '--delay': '4.8s' } as CSSProperties}
        />
        <p
          className="rise-in mt-6 font-mono text-xs uppercase tracking-[0.6em] text-foreground/80 sm:text-sm"
          style={{ '--delay': '5s' } as CSSProperties}
        >
          The Grid Awaits
        </p>
        <div className="rise-in mt-14" style={{ '--delay': '5.8s' } as CSSProperties}>
          <AscendButton onClick={() => dispatch({ type: 'goto', stage: 'auth' })}>Enter Ascend</AscendButton>
        </div>
      </div>

      <p
        className="fade-in-slow absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60"
        style={{ '--delay': '6.4s' } as CSSProperties}
      >
        {'Play · Discover · Build · Prove · Unlock'}
      </p>
    </main>
  )
}
