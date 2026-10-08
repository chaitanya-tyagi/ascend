'use client'

import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/**
 * Customization surface for future progression (clothing, equipment, accessories).
 * Every visual layer reads from this object.
 */
export interface AvatarAppearance {
  suit: string
  coat: string
  trim: string
  energy: string
  visor: string
}

export const DEFAULT_APPEARANCE: AvatarAppearance = {
  suit: '#111318',
  coat: '#1b1e25',
  trim: '#3a3f48',
  energy: '#e3173a',
  visor: '#ff2a4d',
}

interface AvatarProps {
  walking?: boolean
  facing?: 'left' | 'right'
  appearance?: AvatarAppearance
  size?: number
  className?: string
  style?: CSSProperties
}

export function Avatar({
  walking = false,
  facing = 'right',
  appearance = DEFAULT_APPEARANCE,
  size = 64,
  className,
  style,
}: AvatarProps) {
  const a = appearance
  const legAnim = walking ? 'leg-swing 0.5s ease-in-out infinite' : 'none'
  const legAnimOffset = walking ? 'leg-swing 0.5s ease-in-out -0.25s infinite' : 'none'
  return (
    <svg
      viewBox="0 0 40 80"
      width={size / 2}
      height={size}
      className={cn('overflow-visible', className)}
      style={{ ...style, transform: facing === 'left' ? 'scaleX(-1)' : undefined }}
      role="img"
      aria-label="Your avatar"
    >
      <defs>
        <filter id="av-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="av-ground">
          <stop offset="0" stopColor={a.energy} stopOpacity="0.45" />
          <stop offset="1" stopColor={a.energy} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ground presence */}
      <ellipse cx="20" cy="77" rx="16" ry="5" fill="url(#av-ground)" />
      <ellipse cx="20" cy="77" rx="11" ry="3.4" fill="none" stroke={a.energy} strokeOpacity="0.7" strokeWidth="0.6" />

      <g style={{ animation: walking ? 'none' : 'idle-bob 3s ease-in-out infinite' }}>
        {/* Legs */}
        <g style={{ transformOrigin: '17px 48px', animation: legAnim }}>
          <path d="M15 47 L19 47 L18.5 75 L15.5 75 Z" fill={a.suit} />
          <path d="M15.6 62 L18.6 62" stroke={a.energy} strokeWidth="0.5" strokeOpacity="0.8" />
        </g>
        <g style={{ transformOrigin: '23px 48px', animation: legAnimOffset }}>
          <path d="M21 47 L25 47 L24.5 75 L21.5 75 Z" fill={a.suit} />
          <path d="M21.6 62 L24.6 62" stroke={a.energy} strokeWidth="0.5" strokeOpacity="0.8" />
        </g>

        {/* Arms */}
        <g style={{ transformOrigin: '11px 25px', animation: legAnimOffset }}>
          <path d="M9.5 25 L12.5 25 L12 46 L9.8 46 Z" fill={a.coat} />
        </g>
        <g style={{ transformOrigin: '29px 25px', animation: legAnim }}>
          <path d="M27.5 25 L30.5 25 L30.2 46 L28 46 Z" fill={a.coat} />
        </g>

        {/* Long coat — strong silhouette */}
        <path d="M12 23 L28 23 L30.5 58 L24 56 L20 59 L16 56 L9.5 58 Z" fill={a.coat} />
        <path d="M20 26 L20 58" stroke={a.trim} strokeWidth="0.4" />
        <path d="M12 23 L28 23 L27 27 L13 27 Z" fill={a.trim} opacity="0.7" />

        {/* Shoulder plates */}
        <path d="M8.5 23 L13 22 L13 26 L9 27 Z" fill={a.trim} />
        <path d="M31.5 23 L27 22 L27 26 L31 27 Z" fill={a.trim} />

        {/* Chest core */}
        <path d="M20 31 L22 33.5 L20 36 L18 33.5 Z" fill={a.energy} filter="url(#av-glow)" />

        {/* Hood + head */}
        <path d="M13.5 21 L14 9 L20 3.5 L26 9 L26.5 21 L20 23 Z" fill={a.suit} />
        <path d="M14 9 L20 3.5 L26 9" fill="none" stroke={a.trim} strokeWidth="0.5" />
        <path d="M15.5 14.5 L24.5 14.5" stroke={a.visor} strokeWidth="1.4" strokeLinecap="round" filter="url(#av-glow)" />
      </g>
    </svg>
  )
}
