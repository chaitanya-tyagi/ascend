'use client'

import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function SystemLabel({
  children,
  className,
  tone = 'muted',
}: {
  children: ReactNode
  className?: string
  tone?: 'muted' | 'crimson' | 'bright'
}) {
  return (
    <p
      className={cn(
        'font-mono text-[11px] uppercase tracking-[0.28em]',
        tone === 'muted' && 'text-muted-foreground',
        tone === 'crimson' && 'text-crimson',
        tone === 'bright' && 'text-foreground',
        className,
      )}
    >
      {children}
    </p>
  )
}

export function DisplayTitle({
  children,
  className,
  as: Tag = 'h1',
}: {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <Tag className={cn('font-display uppercase leading-tight tracking-[0.12em] text-foreground text-balance', className)}>
      {children}
    </Tag>
  )
}

interface AscendButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  children: ReactNode
}

export function AscendButton({ variant = 'primary', className, children, ...props }: AscendButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'group relative inline-flex min-h-11 items-center justify-center gap-3 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] transition-all duration-300 clip-corner-sm',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson',
        'disabled:pointer-events-none disabled:opacity-35',
        variant === 'primary' &&
          'bg-crimson/10 text-foreground ring-1 ring-inset ring-crimson/70 hover:bg-crimson/25 hover:ring-crimson hover:shadow-[0_0_32px_-6px_var(--crimson)]',
        variant === 'ghost' &&
          'text-muted-foreground ring-1 ring-inset ring-steel/50 hover:text-foreground hover:ring-steel',
        className,
      )}
    >
      {variant === 'primary' && (
        <span aria-hidden className="h-1.5 w-1.5 bg-crimson transition-transform duration-300 group-hover:scale-150" />
      )}
      {children}
    </button>
  )
}

/** A thin bordered frame with corner ticks — the base container for system panels. */
export function Frame({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      style={style}
      className={cn('relative border border-border/80 bg-graphite/70 backdrop-blur-md', className)}
    >
      <span aria-hidden className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-crimson/80" />
      <span aria-hidden className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-steel" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-steel" />
      <span aria-hidden className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-crimson/80" />
      {children}
    </div>
  )
}

export function SegmentBar({ value, max = 10, delay = 0 }: { value: number; max?: number; delay?: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Estimated band ${value} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cn('rise-in h-2.5 flex-1', i < value ? 'bg-crimson/90' : 'bg-steel/30')}
          style={{ '--delay': `${delay + i * 0.06}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}

export function StageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main className={cn('relative z-10 flex min-h-dvh w-full flex-col items-center justify-center px-5 py-16', className)}>
      {children}
    </main>
  )
}
