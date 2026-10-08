'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { WorldNodeId } from '@/lib/ascend/types'
import { findPath, iso, WORLD_NODES } from '@/lib/ascend/world'
import { useJourney } from '../journey-provider'
import { Particles } from '../ui/particles'
import { Avatar } from '../world/avatar'
import { GridHud, type HudNotice } from '../world/grid-hud'
import { VIEW, WorldMap } from '../world/world-map'

const SPEED = 4.2 // tiles per second
const DIRS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
}

function useViewport() {
  const [size, setSize] = useState({ w: 1280, h: 800 })
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}

export function GridWorldStage() {
  const { state, dispatch } = useJourney()
  const { challengeComplete, coreVisited } = state
  const viewport = useViewport()

  const startNode = WORLD_NODES[state.avatarNode]
  const [pos, setPos] = useState({ x: startNode.x, y: startNode.y })
  const [currentNode, setCurrentNode] = useState<WorldNodeId>(state.avatarNode)
  const [moving, setMoving] = useState(false)
  const [facing, setFacing] = useState<'left' | 'right'>('right')
  const [notices, setNotices] = useState<HudNotice[]>([])
  const discovered = useRef(new Set<WorldNodeId>([state.avatarNode]))
  const posRef = useRef(pos)
  const rafRef = useRef(0)

  const coreUnlocked = challengeComplete
  const objective: WorldNodeId | null = !challengeComplete ? 'arena' : !coreVisited ? 'core' : null

  const notify = useCallback((title: string, detail?: string, tone: HudNotice['tone'] = 'info') => {
    const id = Date.now() + Math.random()
    setNotices((n) => [...n.slice(-2), { id, title, detail, tone }])
    setTimeout(() => setNotices((n) => n.filter((x) => x.id !== id)), 3600)
  }, [])

  // Announce state changes when returning to the world
  const announced = useRef(false)
  useEffect(() => {
    if (announced.current) return
    announced.current = true
    if (challengeComplete && !coreVisited) notify('Ascend Core unsealed', 'A path to the Core is now open', 'signal')
    else if (!challengeComplete) notify('Grid initialized', 'Objective: reach the Calibration Arena')
  }, [challengeComplete, coreVisited, notify])

  const isAccessible = useCallback(
    (id: WorldNodeId) => {
      const n = WORLD_NODES[id]
      if (n.kind === 'locked') return false
      if (n.kind === 'core') return coreUnlocked
      return true
    },
    [coreUnlocked],
  )

  const arrive = useCallback(
    (id: WorldNodeId) => {
      setCurrentNode(id)
      dispatch({ type: 'setAvatarNode', node: id })
      const node = WORLD_NODES[id]
      if (!discovered.current.has(id)) {
        discovered.current.add(id)
        if (node.kind === 'waypoint') notify('New area discovered', node.label)
      }
      if (id === 'arena' && !challengeComplete) notify('Challenge node detected', 'Challenge // 001', 'signal')
    },
    [dispatch, notify, challengeComplete],
  )

  const travel = useCallback(
    (path: WorldNodeId[]) => {
      if (path.length < 2) return
      cancelAnimationFrame(rafRef.current)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const target = path[path.length - 1]
      if (reduced) {
        const n = WORLD_NODES[target]
        posRef.current = { x: n.x, y: n.y }
        setPos(posRef.current)
        arrive(target)
        return
      }
      let segment = 1
      let last = performance.now()
      setMoving(true)
      const step = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        const goal = WORLD_NODES[path[segment]]
        const p = posRef.current
        const dx = goal.x - p.x
        const dy = goal.y - p.y
        const dist = Math.hypot(dx, dy)
        const stepLen = SPEED * dt
        const screenDx = dx - dy
        if (Math.abs(screenDx) > 0.01) setFacing(screenDx < 0 ? 'left' : 'right')
        if (dist <= stepLen) {
          posRef.current = { x: goal.x, y: goal.y }
          segment += 1
          if (segment >= path.length) {
            setPos(posRef.current)
            setMoving(false)
            arrive(target)
            return
          }
        } else {
          posRef.current = { x: p.x + (dx / dist) * stepLen, y: p.y + (dy / dist) * stepLen }
        }
        setPos(posRef.current)
        rafRef.current = requestAnimationFrame(step)
      }
      rafRef.current = requestAnimationFrame(step)
    },
    [arrive],
  )

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const selectNode = useCallback(
    (id: WorldNodeId) => {
      if (moving) return
      const node = WORLD_NODES[id]
      if (!isAccessible(id)) {
        notify(`${node.label} — locked`, node.lockReason ?? 'Requires further development', 'locked')
        return
      }
      if (id === currentNode) return
      const path = findPath(currentNode, id, isAccessible)
      if (path) travel(path)
    },
    [moving, isAccessible, currentNode, travel, notify],
  )

  const interact = useCallback(() => {
    if (moving) return
    if (currentNode === 'arena' && !challengeComplete) dispatch({ type: 'goto', stage: 'challenge' })
    if (currentNode === 'core' && coreUnlocked) dispatch({ type: 'visitCore' })
  }, [moving, currentNode, challengeComplete, coreUnlocked, dispatch])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('input, textarea')) return
      if (e.code === 'KeyE' || (e.code === 'Enter' && target === document.body)) {
        e.preventDefault()
        interact()
        return
      }
      const dir = DIRS[e.code]
      if (!dir || moving) return
      e.preventDefault()
      const here = WORLD_NODES[currentNode]
      const [hx, hy] = iso(here.x, here.y)
      let best: { id: WorldNodeId; score: number } | null = null
      for (const nId of here.neighbors) {
        const n = WORLD_NODES[nId]
        const [nx, ny] = iso(n.x, n.y)
        const len = Math.hypot(nx - hx, ny - hy)
        const score = ((nx - hx) * dir[0] + (ny - hy) * dir[1]) / len
        if (score > 0.4 && (!best || score > best.score)) best = { id: nId, score }
      }
      if (best) selectNode(best.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentNode, moving, interact, selectNode])

  // Camera
  const isMobile = viewport.w < 640
  const scale = Math.max(0.55, Math.min(1.15, Math.min(viewport.w / 1150, viewport.h / 820)))
  const [sx, sy] = iso(pos.x, pos.y)
  const camX = viewport.w / 2 - (sx - VIEW.x) * scale
  const camY = viewport.h * (isMobile ? 0.5 : 0.56) - (sy - VIEW.y) * scale

  const prompt =
    !moving && currentNode === 'arena' && !challengeComplete
      ? { title: 'Challenge node detected', detail: 'Challenge // 001 — The Limited Resource', action: 'Enter Arena' }
      : !moving && currentNode === 'core' && coreUnlocked
        ? { title: 'Ascend Core', detail: 'Status interface available', action: 'Enter Core' }
        : null

  return (
    <main className="fixed inset-0 overflow-hidden bg-obsidian" aria-label="The Grid">
      <h1 className="sr-only">The Grid</h1>
      {/* Far layer — megastructures, slow parallax */}
      <div
        aria-hidden
        className="absolute -inset-[8%] will-change-transform"
        style={{ transform: `translate3d(${(camX - viewport.w / 2) * 0.03}px, ${(camY - viewport.h / 2) * 0.02}px, 0)` }}
      >
        <Image src="/images/grid-skyline.png" alt="" fill priority sizes="120vw" className="object-cover object-top opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/70 to-obsidian" />
      </div>

      {/* World layer */}
      <div
        className="absolute left-0 top-0 origin-top-left will-change-transform"
        style={{ transform: `translate3d(${camX}px, ${camY}px, 0) scale(${scale})`, width: VIEW.w, height: VIEW.h }}
      >
        <WorldMap coreUnlocked={coreUnlocked} objective={objective} onSelectNode={selectNode} />
        <div
          className="pointer-events-none absolute"
          style={{ left: sx - VIEW.x, top: sy - VIEW.y, transform: 'translate(-50%, -96%)' }}
        >
          <Avatar walking={moving} facing={facing} size={60} />
        </div>
      </div>

      {/* Near atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Particles density={0.00003} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(5,6,8,0.85)_100%)]" />
      </div>

      <GridHud
        userName={state.user?.name ?? 'Operator'}
        sector={WORLD_NODES[currentNode].label}
        objective={objective}
        notices={notices}
        prompt={prompt}
        onInteract={interact}
        currentNode={currentNode}
        moving={moving}
        isAccessible={isAccessible}
        onTravel={selectNode}
      />
    </main>
  )
}
