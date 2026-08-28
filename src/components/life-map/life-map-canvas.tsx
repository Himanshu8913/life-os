import { motion } from 'framer-motion'
import { Minus, Plus, RotateCcw } from 'lucide-react'
import { GOAL_CATEGORY_META } from '@/domain/goals/category-meta'
import { getNodePosition } from '@/domain/life-map/layout'
import type { LifeAreaNode, LifeMapCenter } from '@/domain/life-map/build-life-map'
import { usePanZoom } from '@/hooks/use-pan-zoom'
import { useMotionConfig } from '@/hooks/use-motion'
import type { GoalCategory } from '@/types'

const CANVAS_SIZE = 520
const CENTER = CANVAS_SIZE / 2
const RADIUS = 180
const NODE_R = 36

interface LifeMapCanvasProps {
  center: LifeMapCenter
  areas: LifeAreaNode[]
  selectedCategory: GoalCategory | null
  onSelectCategory: (category: GoalCategory | null) => void
}

function progressColor(score: number, categoryHex: string): string {
  if (score >= 70) return 'var(--color-emerald)'
  if (score >= 40) return categoryHex
  return 'var(--color-muted)'
}

export function LifeMapCanvas({
  center,
  areas,
  selectedCategory,
  onSelectCategory,
}: LifeMapCanvasProps) {
  const { reducedMotion } = useMotionConfig()
  const panZoom = usePanZoom(1)

  return (
    <div className="glass-panel relative overflow-hidden shadow-[var(--shadow-card)]">
      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <button
          type="button"
          onClick={panZoom.zoomIn}
          className="rounded-md border border-border bg-surface-elevated/90 p-1.5 text-muted hover:text-foreground"
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={panZoom.zoomOut}
          className="rounded-md border border-border bg-surface-elevated/90 p-1.5 text-muted hover:text-foreground"
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={panZoom.reset}
          className="rounded-md border border-border bg-surface-elevated/90 p-1.5 text-muted hover:text-foreground"
          aria-label="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div
        className="cursor-grab touch-none active:cursor-grabbing"
        style={{ height: CANVAS_SIZE }}
        onWheel={panZoom.onWheel}
        onPointerDown={panZoom.onPointerDown}
        onPointerMove={panZoom.onPointerMove}
        onPointerUp={panZoom.onPointerUp}
        onPointerLeave={panZoom.onPointerUp}
      >
        <svg
          width="100%"
          height={CANVAS_SIZE}
          viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
          className="select-none"
          role="img"
          aria-label="Life map visualization"
        >
          <g
            transform={`translate(${CENTER + panZoom.x}, ${CENTER + panZoom.y}) scale(${panZoom.scale}) translate(${-CENTER}, ${-CENTER})`}
          >
            {/* Connection lines */}
            {areas.map((area) => {
              const pos = getNodePosition(area.angle, RADIUS, CENTER, CENTER)
              const selected = selectedCategory === area.category
              const meta = GOAL_CATEGORY_META[area.category]
              return (
                <line
                  key={`line-${area.category}`}
                  x1={CENTER}
                  y1={CENTER}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={
                    selected
                      ? `${meta.hex}99`
                      : `${meta.hex}33`
                  }
                  strokeWidth={selected ? 2.5 : 1}
                />
              )
            })}

            {/* Area nodes */}
            {areas.map((area, i) => {
              const pos = getNodePosition(area.angle, RADIUS, CENTER, CENTER)
              const selected = selectedCategory === area.category
              const score = area.stats.progressScore
              const meta = GOAL_CATEGORY_META[area.category]

              return (
                <g
                  key={area.category}
                  data-pan-zoom-ignore
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectCategory(selected ? null : area.category)
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${area.label}, ${score}% progress`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onSelectCategory(selected ? null : area.category)
                    }
                  }}
                >
                  <motion.circle
                    cx={0}
                    cy={0}
                    r={NODE_R}
                    fill={`${meta.hex}18`}
                    stroke={selected ? meta.hex : `${meta.hex}55`}
                    strokeWidth={selected ? 3 : 1.5}
                    initial={reducedMotion ? false : { scale: 0 }}
                    animate={{
                      scale: selected ? 1.08 : 1,
                    }}
                    transition={{
                      delay: i * 0.05,
                      type: 'spring',
                      stiffness: 380,
                      damping: 26,
                    }}
                  />
                  <circle
                    cx={0}
                    cy={0}
                    r={NODE_R - 4}
                    fill="none"
                    stroke={progressColor(score, meta.hex)}
                    strokeWidth={3}
                    strokeDasharray={`${(score / 100) * 2 * Math.PI * (NODE_R - 4)} ${2 * Math.PI * (NODE_R - 4)}`}
                    strokeLinecap="round"
                    transform="rotate(-90)"
                    opacity={score > 0 ? 1 : 0.3}
                  />
                  <text
                    textAnchor="middle"
                    dy="-2"
                    className="pointer-events-none text-lg"
                    aria-hidden
                  >
                    {area.icon}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="18"
                    className="pointer-events-none fill-foreground text-[10px] font-medium"
                  >
                    {area.label}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="30"
                    className="pointer-events-none fill-muted font-mono text-[9px]"
                  >
                    {score}%
                  </text>
                </g>
              )
            })}

            {/* Center YOU node */}
            <g
              data-pan-zoom-ignore
              transform={`translate(${CENTER}, ${CENTER})`}
              className="cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onSelectCategory(null)}
              role="button"
              tabIndex={0}
              aria-label={`You, level ${center.level}`}
            >
              <defs>
                <radialGradient id="centerGradient">
                  <stop offset="0%" stopColor="#e879f9" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.1" />
                </radialGradient>
                <linearGradient id="centerStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <circle
                cx={0}
                cy={0}
                r={48}
                fill="url(#centerGradient)"
                stroke="url(#centerStroke)"
                strokeWidth={2.5}
              />
              <text
                textAnchor="middle"
                dy="-6"
                className="fill-accent text-[10px] font-semibold tracking-widest"
              >
                YOU
              </text>
              <text
                textAnchor="middle"
                dy="10"
                className="fill-foreground text-xs font-medium"
              >
                {center.label}
              </text>
              <text
                textAnchor="middle"
                dy="26"
                className="fill-muted font-mono text-[10px]"
              >
                Lv.{center.level}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <p className="border-t border-border/60 px-4 py-2 text-center text-[11px] text-muted">
        Drag to pan · Scroll to zoom · Click a node to expand
      </p>
    </div>
  )
}
