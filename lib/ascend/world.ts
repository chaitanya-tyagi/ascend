/**
 * THE GRID — world layout for the first playable slice.
 * Coordinates are isometric tile units; projection lives in `iso()`.
 */
import type { WorldNode, WorldNodeId } from './types'

export const TILE_W = 64
export const TILE_H = 32

export function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * (TILE_W / 2), (x + y) * (TILE_H / 2) - z]
}

export const WORLD_NODES: Record<WorldNodeId, WorldNode> = {
  entry: {
    id: 'entry',
    label: 'Entry Point',
    sublabel: 'Home',
    x: 1,
    y: 14,
    neighbors: ['city'],
    kind: 'waypoint',
  },
  city: {
    id: 'city',
    label: 'Grid City',
    sublabel: 'Sector 01',
    x: 7,
    y: 14,
    neighbors: ['entry', 'spine'],
    kind: 'waypoint',
  },
  spine: {
    id: 'spine',
    label: 'Central Spine',
    sublabel: 'Junction',
    x: 7,
    y: 8,
    neighbors: ['city', 'arena', 'core', 'sector03'],
    kind: 'waypoint',
  },
  arena: {
    id: 'arena',
    label: 'Calibration Arena',
    sublabel: 'Challenge node',
    x: 12,
    y: 8,
    neighbors: ['spine', 'advanced-arena'],
    kind: 'challenge',
  },
  core: {
    id: 'core',
    label: 'Ascend Core',
    sublabel: 'Status',
    x: 7,
    y: 3,
    neighbors: ['spine', 'deep-grid'],
    kind: 'core',
    lockReason: 'Complete your first challenge',
  },
  sector03: {
    id: 'sector03',
    label: 'Sector 03',
    sublabel: 'Locked',
    x: 2,
    y: 8,
    neighbors: ['spine'],
    kind: 'locked',
    lockReason: 'Requires further development',
  },
  'advanced-arena': {
    id: 'advanced-arena',
    label: 'Advanced Arena',
    sublabel: 'Locked',
    x: 16,
    y: 8,
    neighbors: ['arena'],
    kind: 'locked',
    lockReason: 'Requires further development',
  },
  'deep-grid': {
    id: 'deep-grid',
    label: 'Deep Grid',
    sublabel: 'Locked',
    x: 13,
    y: 3,
    neighbors: ['core'],
    kind: 'locked',
    lockReason: 'Requires further development',
  },
}

export const ROAD_SEGMENTS: [WorldNodeId, WorldNodeId][] = [
  ['entry', 'city'],
  ['city', 'spine'],
  ['spine', 'arena'],
  ['spine', 'core'],
  ['spine', 'sector03'],
  ['arena', 'advanced-arena'],
  ['core', 'deep-grid'],
]

export interface Building {
  id: string
  x: number
  y: number
  w: number
  d: number
  h: number
  accent: boolean
}

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function distanceToSegment(px: number, py: number, a: WorldNode, b: WorldNode) {
  const minX = Math.min(a.x, b.x)
  const maxX = Math.max(a.x, b.x)
  const minY = Math.min(a.y, b.y)
  const maxY = Math.max(a.y, b.y)
  const dx = px < minX ? minX - px : px > maxX ? px - maxX : 0
  const dy = py < minY ? minY - py : py > maxY ? py - maxY : 0
  return Math.max(dx, dy)
}

export const WORLD_BOUNDS = { minX: -1, maxX: 18, minY: -1, maxY: 17 }

const EXCLUSION_ZONES = [
  { x: 12, y: 8, r: 3 }, // arena ring
  { x: 7, y: 1, r: 3 }, // core foundation
  { x: 15, y: 2, r: 3.5 }, // deep grid void
]

export function generateBuildings(): Building[] {
  const rand = seeded(42)
  const buildings: Building[] = []
  const occupied = new Set<string>()
  const nodes = Object.values(WORLD_NODES)

  for (let x = WORLD_BOUNDS.minX + 1; x < WORLD_BOUNDS.maxX; x++) {
    for (let y = WORLD_BOUNDS.minY + 1; y < WORLD_BOUNDS.maxY; y++) {
      if (occupied.has(`${x},${y}`)) continue
      const nearRoad = ROAD_SEGMENTS.some(
        ([a, b]) => distanceToSegment(x + 0.5, y + 0.5, WORLD_NODES[a], WORLD_NODES[b]) < 1.2,
      )
      if (nearRoad) continue
      const nearNode = nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 2)
      if (nearNode) continue
      const inZone = EXCLUSION_ZONES.some((z) => Math.hypot(z.x - x, z.y - y) < z.r)
      if (inZone) continue
      if (rand() > 0.42) continue

      const wide = rand() > 0.75 && !occupied.has(`${x + 1},${y}`)
      const w = wide ? 2 : 1
      const distanceFromCore = Math.hypot(x - 7, y - 1)
      const tall = rand()
      const h = Math.round(18 + tall * tall * 130 + Math.max(0, 60 - distanceFromCore * 4))
      buildings.push({
        id: `b-${x}-${y}`,
        x: x + 0.1,
        y: y + 0.1,
        w: w - 0.2,
        d: 0.8,
        h,
        accent: rand() > 0.88,
      })
      for (let i = 0; i < w; i++) occupied.add(`${x + i},${y}`)
    }
  }

  return buildings.sort((a, b) => a.x + a.y - (b.x + b.y))
}

/** Breadth-first path through accessible nodes. */
export function findPath(
  from: WorldNodeId,
  to: WorldNodeId,
  isAccessible: (id: WorldNodeId) => boolean,
): WorldNodeId[] | null {
  const queue: WorldNodeId[][] = [[from]]
  const seen = new Set<WorldNodeId>([from])
  while (queue.length) {
    const path = queue.shift()!
    const last = path[path.length - 1]
    if (last === to) return path
    for (const next of WORLD_NODES[last].neighbors) {
      if (seen.has(next) || !isAccessible(next)) continue
      seen.add(next)
      queue.push([...path, next])
    }
  }
  return null
}
