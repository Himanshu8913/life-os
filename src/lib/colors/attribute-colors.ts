import type { LifeAttributeKey } from '@/types/enums'

export const ATTRIBUTE_COLORS: Record<
  LifeAttributeKey,
  { hex: string; className: string }
> = {
  discipline: { hex: '#fb923c', className: 'bg-orange-400' },
  creativity: { hex: '#e879f9', className: 'bg-fuchsia-400' },
  fitness: { hex: '#34d399', className: 'bg-emerald-400' },
  learning: { hex: '#a78bfa', className: 'bg-violet-400' },
  social: { hex: '#fb7185', className: 'bg-rose-400' },
  finance: { hex: '#fbbf24', className: 'bg-amber-400' },
}
