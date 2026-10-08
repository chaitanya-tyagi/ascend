'use client'

import { memo, useMemo, type CSSProperties, type KeyboardEvent } from 'react'
import type { WorldNode, WorldNodeId } from '@/lib/ascend/types'
import { generateBuildings, iso, ROAD_SEGMENTS, WORLD_BOUNDS, WORLD_NODES, type Building } from '@/lib/ascend/world'

export const VIEW = { x: -720, y: -520, w: 1480, h: 1180 }

const pts = (...p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(' ')

interface WorldMapProps {
  coreUnlocked: boolean
  objective: WorldNodeId | null
  onSelectNode: (id: WorldNodeId) => void
}

export const WorldMap = memo(function WorldMap({ coreUnlocked, objective, onSelectNode }: WorldMapProps) {
  const buildings = useMemo(() => generateBuildings(), [])
  const { minX, maxX, minY, maxY } = WORLD_BOUNDS

  return (
    <svg
      width={VIEW.w}
      height={VIEW.h}
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
      className="absolute left-0 top-0 overflow-visible"
      aria-label="The Grid — city map"
      role="group"
    >
      <defs>
        <filter id="w-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="w-void" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#2a1648" stopOpacity="0.55" />
          <stop offset="1" stopColor="#050608" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="w-core-light" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e3173a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#e3173a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="w-runner-trail" x1="0" x2="1">
          <stop offset="0" stopColor="#e3173a" stopOpacity="0" />
          <stop offset="1" stopColor="#e3173a" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="w-ground-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0b0e" />
          <stop offset="1" stopColor="#07080a" />
        </linearGradient>
      </defs>

      {/* Ground plane */}
      <polygon
        points={pts(iso(minX, minY), iso(maxX, minY), iso(maxX, maxY), iso(minX, maxY))}
        fill="url(#w-ground-fade)"
        stroke="#1a1d23"
      />
      <g stroke="#15181d" strokeWidth="1">
        {Array.from({ length: maxX - minX + 1 }, (_, i) => minX + i).map((x) => (
          <line key={`gx${x}`} x1={iso(x, minY)[0]} y1={iso(x, minY)[1]} x2={iso(x, maxY)[0]} y2={iso(x, maxY)[1]} />
        ))}
        {Array.from({ length: maxY - minY + 1 }, (_, i) => minY + i).map((y) => (
          <line key={`gy${y}`} x1={iso(minX, y)[0]} y1={iso(minX, y)[1]} x2={iso(maxX, y)[0]} y2={iso(maxX, y)[1]} />
        ))}
      </g>

      <DeepGridVoid />
      <RunnerLine />
      <Roads coreUnlocked={coreUnlocked} />
      <ArenaFloor />
      <AdvancedArenaGhost />
      <Sector03Ghost />

      <ellipse cx={iso(7, 1)[0]} cy={iso(7, 1)[1]} rx="220" ry="110" fill="url(#w-core-light)" />

      {/* Depth-sorted architecture */}
      {buildings
        .filter((b) => b.x + b.y < 8)
        .map((b) => (
          <IsoBuilding key={b.id} b={b} />
        ))}
      <AscendCoreStructure unlocked={coreUnlocked} />
      {buildings
        .filter((b) => b.x + b.y >= 8)
        .map((b) => (
          <IsoBuilding key={b.id} b={b} />
        ))}

      <ArenaMonolith />

      {Object.values(WORLD_NODES).map((n) => (
        <NodeMarker
          key={n.id}
          node={n}
          locked={n.kind === 'locked' || (n.kind === 'core' && !coreUnlocked)}
          isObjective={objective === n.id}
          onSelect={onSelectNode}
        />
      ))}
    </svg>
  )
})

function IsoBuilding({ b }: { b: Building }) {
  const { x, y, w, d, h } = b
  const top = pts(iso(x, y, h), iso(x + w, y, h), iso(x + w, y + d, h), iso(x, y + d, h))
  const left = pts(iso(x, y + d, 0), iso(x + w, y + d, 0), iso(x + w, y + d, h), iso(x, y + d, h))
  const right = pts(iso(x + w, y, 0), iso(x + w, y + d, 0), iso(x + w, y + d, h), iso(x + w, y, h))
  const bands = Math.max(1, Math.floor(h / 22))

  return (
    <g>
      <polygon points={left} fill="#0e1014" stroke="#1f2228" strokeWidth="0.6" />
      <polygon points={right} fill="#14171c" stroke="#22262d" strokeWidth="0.6" />
      <polygon points={top} fill="#1c1f26" stroke="#2c3038" strokeWidth="0.6" />
      {Array.from({ length: bands }, (_, i) => {
        const z = 10 + i * 22
        const [ax, ay] = iso(x + w, y + 0.12, z)
        const [bx, by] = iso(x + w, y + d - 0.12, z)
        const [cx, cy] = iso(x + 0.12, y + d, z)
        const [dx, dy] = iso(x + w - 0.12, y + d, z)
        return (
          <g key={i} strokeWidth="0.8">
            <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#3a3f48" strokeOpacity={0.35} />
            <line x1={cx} y1={cy} x2={dx} y2={dy} stroke="#3a3f48" strokeOpacity={0.2} />
          </g>
        )
      })}
      {b.accent && (
        <line
          x1={iso(x + w, y + d, 0)[0]}
          y1={iso(x + w, y + d, 0)[1]}
          x2={iso(x + w, y + d, h)[0]}
          y2={iso(x + w, y + d, h)[1]}
          stroke="#e3173a"
          strokeWidth="1.2"
          strokeOpacity="0.85"
          filter="url(#w-glow)"
        />
      )}
    </g>
  )
}

function Roads({ coreUnlocked }: { coreUnlocked: boolean }) {
  return (
    <g>
      {ROAD_SEGMENTS.map(([aId, bId]) => {
        const a = WORLD_NODES[aId]
        const b = WORLD_NODES[bId]
        const toLocked = a.kind === 'locked' || b.kind === 'locked'
        const toSealedCore = (a.kind === 'core' || b.kind === 'core') && !coreUnlocked && !toLocked
        const x0 = Math.min(a.x, b.x) - 0.5
        const x1 = Math.max(a.x, b.x) + 0.5
        const y0 = Math.min(a.y, b.y) - 0.5
        const y1 = Math.max(a.y, b.y) + 0.5
        const strip = pts(iso(x0, y0), iso(x1, y0), iso(x1, y1), iso(x0, y1))
        const [ax, ay] = iso(a.x, a.y)
        const [bx, by] = iso(b.x, b.y)
        return (
          <g key={`${aId}-${bId}`}>
            <polygon points={strip} fill={toLocked ? '#0b0c0f' : '#111317'} stroke="#1f2228" strokeWidth="0.8" />
            <line
              x1={ax}
              y1={ay}
              x2={bx}
              y2={by}
              stroke={toLocked ? '#3a3f48' : '#e3173a'}
              strokeOpacity={toLocked ? 0.45 : toSealedCore ? 0.3 : 0.5}
              strokeWidth="1"
              strokeDasharray={toLocked ? '4 8' : undefined}
            />
            {!toLocked && !toSealedCore && (
              <line
                x1={ax}
                y1={ay}
                x2={bx}
                y2={by}
                stroke="#ff3355"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="energy-flow"
                filter="url(#w-glow)"
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

const ARENA = WORLD_NODES.arena
function ArenaFloor() {
  const [cx, cy] = iso(ARENA.x, ARENA.y)
  return (
    <g>
      {[2.6, 2, 1.3].map((r, i) => (
        <ellipse
          key={r}
          cx={cx}
          cy={cy}
          rx={r * 45}
          ry={r * 22.6}
          fill={i === 0 ? '#0c0d10' : 'none'}
          stroke="#e3173a"
          strokeOpacity={0.25 + i * 0.2}
          strokeWidth={i === 2 ? 1.4 : 0.8}
          strokeDasharray={i === 1 ? '2 6' : undefined}
        />
      ))}
      {Array.from({ length: 8 }, (_, i) => {
        const t = (i / 8) * Math.PI * 2
        const px = cx + Math.cos(t) * 2.6 * 45
        const py = cy + Math.sin(t) * 2.6 * 22.6
        return (
          <g key={i}>
            <line x1={px} y1={py} x2={px} y2={py - 26} stroke="#3a3f48" strokeWidth="3" />
            <circle cx={px} cy={py - 27} r="1.6" fill="#e3173a" />
          </g>
        )
      })}
    </g>
  )
}

function ArenaMonolith() {
  const [cx, cy] = iso(ARENA.x, ARENA.y)
  return (
    <g style={{ animation: 'idle-bob 4s ease-in-out infinite' }}>
      <polygon
        points={pts([cx, cy - 110], [cx + 12, cy - 78], [cx, cy - 50], [cx - 12, cy - 78])}
        fill="#0e1014"
        stroke="#e3173a"
        strokeOpacity="0.7"
        strokeWidth="0.8"
      />
      <line x1={cx} y1={cy - 110} x2={cx} y2={cy - 50} stroke="#3a3f48" strokeWidth="0.6" />
    </g>
  )
}

function AdvancedArenaGhost() {
  const n = WORLD_NODES['advanced-arena']
  const [cx, cy] = iso(n.x, n.y)
  return (
    <g opacity="0.55">
      {[1.8, 1.1].map((r) => (
        <ellipse key={r} cx={cx} cy={cy} rx={r * 45} ry={r * 22.6} fill="none" stroke="#3a3f48" strokeDasharray="3 6" />
      ))}
    </g>
  )
}

function Sector03Ghost() {
  const blocks = [
    { x: 0, y: 5.5, h: 70 },
    { x: 1.5, y: 5.6, h: 110 },
    { x: 3, y: 5.5, h: 55 },
    { x: 0.2, y: 9.8, h: 40 },
    { x: 3, y: 9.8, h: 90 },
  ]
  return (
    <g opacity="0.7">
      {blocks.map((b, i) => {
        const w = 1
        const d = 1
        const outline = pts(
          iso(b.x, b.y + d, 0),
          iso(b.x + w, b.y + d, 0),
          iso(b.x + w, b.y, 0),
          iso(b.x + w, b.y, b.h),
          iso(b.x, b.y, b.h),
          iso(b.x, b.y + d, b.h),
        )
        return (
          <g key={i}>
            <polygon points={outline} fill="#08090b" stroke="#3a3f48" strokeOpacity="0.6" strokeDasharray="3 4" strokeWidth="0.8" />
            <line
              x1={iso(b.x + w, b.y + d, 0)[0]}
              y1={iso(b.x + w, b.y + d, 0)[1]}
              x2={iso(b.x + w, b.y + d, b.h)[0]}
              y2={iso(b.x + w, b.y + d, b.h)[1]}
              stroke="#3a3f48"
              strokeOpacity="0.5"
              strokeDasharray="3 4"
            />
          </g>
        )
      })}
    </g>
  )
}

function DeepGridVoid() {
  const n = WORLD_NODES['deep-grid']
  const [cx, cy] = iso(n.x + 2.5, n.y - 1.5)
  const fragments = [
    [14, 3, 0],
    [15, 1.5, 8],
    [16.5, 2.5, 18],
    [17, 0.5, 30],
    [15.5, -0.5, 24],
    [18, 2, 40],
    [16, 4, 4],
  ] as const
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="260" ry="130" fill="url(#w-void)" />
      {fragments.map(([x, y, z], i) => (
        <polygon
          key={i}
          points={pts(iso(x, y, z), iso(x + 0.8, y, z), iso(x + 0.8, y + 0.8, z), iso(x, y + 0.8, z))}
          fill="#0d0b14"
          stroke="#3b2a5c"
          strokeOpacity="0.8"
          strokeWidth="0.8"
          style={{ animation: `idle-bob ${3 + i * 0.6}s ease-in-out ${-i}s infinite` }}
        />
      ))}
    </g>
  )
}

/** Decorative transit lane where an original "Runner" vehicle occasionally passes. */
function RunnerLine() {
  const [ax, ay] = iso(-1, 16.4)
  const [bx, by] = iso(18, 16.4)
  const [lx, ly] = iso(0.4, 16.4)
  return (
    <g>
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#1f2228" strokeWidth="10" />
      <line x1={ax} y1={ay} x2={bx} y2={by} stroke="#3a3f48" strokeOpacity="0.6" strokeWidth="0.8" />
      <text
        x={lx}
        y={ly + 22}
        fill="#6b707a"
        fontSize="8"
        letterSpacing="2.5"
        className="font-mono uppercase"
        transform={`rotate(26.565 ${lx} ${ly + 22})`}
      >
        RUNNER LINE // STATION 01
      </text>
      <g className="motion-safe-only">
        <g>
          <animateMotion
            dur="16s"
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="0;0;1;1"
            keyTimes="0;0.35;0.62;1"
            calcMode="linear"
            path={`M${ax},${ay} L${bx},${by}`}
          />
          <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.34;0.36;0.6;0.62;1" dur="16s" repeatCount="indefinite" />
          <rect x="-90" y="-1.5" width="76" height="3" fill="url(#w-runner-trail)" filter="url(#w-glow)" />
          <polygon points="-16,-4 6,-3.5 18,0 6,3.5 -16,4 -12,0" fill="#08090b" stroke="#e3173a" strokeWidth="0.9" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="#e3173a" strokeWidth="0.6" />
        </g>
      </g>
    </g>
  )
}

function AscendCoreStructure({ unlocked }: { unlocked: boolean }) {
  const base = { x: 6, y: 0, w: 2, d: 2, h: 340 }
  const spire = { x: 6.45, y: 0.45, w: 1.1, d: 1.1, h: 470 }
  const [rcx, rcy] = iso(7, 1, 300)

  const box = (b: typeof base, z0 = 0) => ({
    top: pts(iso(b.x, b.y, b.h), iso(b.x + b.w, b.y, b.h), iso(b.x + b.w, b.y + b.d, b.h), iso(b.x, b.y + b.d, b.h)),
    left: pts(iso(b.x, b.y + b.d, z0), iso(b.x + b.w, b.y + b.d, z0), iso(b.x + b.w, b.y + b.d, b.h), iso(b.x, b.y + b.d, b.h)),
    right: pts(iso(b.x + b.w, b.y, z0), iso(b.x + b.w, b.y + b.d, z0), iso(b.x + b.w, b.y + b.d, b.h), iso(b.x + b.w, b.y, b.h)),
  })
  const b1 = box(base)
  const b2 = box(spire, base.h)
  const [ex0, ey0] = iso(base.x + base.w, base.y + base.d, 0)
  const [ex1, ey1] = iso(spire.x + spire.w, spire.y + spire.d, spire.h)

  return (
    <g aria-hidden>
      <polygon points={b1.left} fill="#0b0c10" stroke="#23262d" />
      <polygon points={b1.right} fill="#111318" stroke="#23262d" />
      <polygon points={b1.top} fill="#16181e" stroke="#2c3038" />
      <polygon points={b2.left} fill="#0b0c10" stroke="#23262d" />
      <polygon points={b2.right} fill="#111318" stroke="#23262d" />
      <polygon points={b2.top} fill="#1a1c22" stroke="#2c3038" />
      <line x1={ex0} y1={ey0} x2={ex1} y2={ey1} stroke="#e3173a" strokeWidth="1.4" strokeOpacity={unlocked ? 1 : 0.55} filter="url(#w-glow)" />
      <ellipse
        cx={rcx}
        cy={rcy}
        rx="96"
        ry="22"
        fill="none"
        stroke="#e3173a"
        strokeWidth={unlocked ? 2.2 : 1.4}
        strokeOpacity={unlocked ? 1 : 0.6}
        filter="url(#w-glow)"
        style={{ animation: 'idle-bob 5s ease-in-out infinite' }}
      />
    </g>
  )
}

function NodeMarker({
  node,
  locked,
  isObjective,
  onSelect,
}: {
  node: WorldNode
  locked: boolean
  isObjective: boolean
  onSelect: (id: WorldNodeId) => void
}) {
  const [cx, cy] = iso(node.x, node.y)
  const voidTone = node.id === 'deep-grid'
  const stroke = locked ? (voidTone ? '#5b3f8c' : '#4a4f58') : '#e3173a'
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(node.id)
    }
  }
  const labelY = cy - (node.kind === 'core' ? 46 : 40)

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${node.label}${locked ? ' — locked' : ''}`}
      onClick={() => onSelect(node.id)}
      onKeyDown={onKey}
      className="cursor-pointer focus:outline-none [&:focus-visible_.node-diamond]:stroke-white"
    >
      <polygon
        points={pts([cx, cy - 30], [cx + 60, cy], [cx, cy + 30], [cx - 60, cy])}
        fill="transparent"
      />
      <polygon
        className="node-diamond"
        points={pts([cx, cy - 13], [cx + 26, cy], [cx, cy + 13], [cx - 26, cy])}
        fill={locked ? '#0a0b0e' : '#160a0e'}
        stroke={stroke}
        strokeWidth="1.2"
        strokeDasharray={locked ? '3 4' : undefined}
      />
      {!locked && <circle cx={cx} cy={cy} r="2.4" fill="#e3173a" filter="url(#w-glow)" />}
      {isObjective && (
        <ellipse
          cx={cx}
          cy={cy}
          rx="26"
          ry="13"
          fill="none"
          stroke="#e3173a"
          strokeWidth="1.5"
          style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'pulse-ring 2s ease-out infinite' } as CSSProperties}
        />
      )}
      <g transform={`translate(${cx} ${labelY})`}>
        <line x1="0" y1="8" x2="0" y2="26" stroke={stroke} strokeOpacity="0.5" strokeWidth="0.8" />
        <text
          textAnchor="middle"
          fill={locked ? '#7a7f88' : '#e7e8eb'}
          fontSize="10"
          letterSpacing="2.6"
          className="font-mono uppercase"
        >
          {node.label.toUpperCase()}
        </text>
        <text
          y="-13"
          textAnchor="middle"
          fill={locked ? (voidTone ? '#7d63ad' : '#a01a33') : '#8a8f99'}
          fontSize="7.5"
          letterSpacing="2.4"
          className="font-mono uppercase"
        >
          {locked ? 'LOCKED' : node.sublabel.toUpperCase()}
        </text>
      </g>
    </g>
  )
}
