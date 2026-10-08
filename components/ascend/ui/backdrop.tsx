'use client'

import Image from 'next/image'
import { Particles } from './particles'
import { cn } from '@/lib/utils'

interface BackdropProps {
  image?: string
  /** 0–1 visibility of the image layer */
  intensity?: number
  particles?: boolean
  className?: string
}

/** Shared atmospheric layer so every stage feels like part of the same world. */
export function Backdrop({ image = '/images/grid-skyline.png', intensity = 0.35, particles = true, className }: BackdropProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden bg-obsidian', className)}>
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center transition-opacity duration-1000"
        style={{ opacity: intensity }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,6,8,0.55)_55%,#050608_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian to-transparent" />
      <div className="scanlines absolute inset-0" />
      {particles && <Particles />}
    </div>
  )
}
