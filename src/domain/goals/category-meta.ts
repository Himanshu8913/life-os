import type { GoalCategory } from '@/types'

export interface CategoryMeta {
  label: string
  icon: string
  color: string
  bg: string
  border: string
  hex: string
}

export const GOAL_CATEGORY_META: Record<GoalCategory, CategoryMeta> = {
  WORK: {
    label: 'Work',
    icon: '💼',
    color: 'text-sky-400',
    bg: 'bg-sky-400/15',
    border: 'border-sky-400/40',
    hex: '#38bdf8',
  },
  LEARNING: {
    label: 'Learning',
    icon: '📚',
    color: 'text-violet-400',
    bg: 'bg-violet-400/15',
    border: 'border-violet-400/40',
    hex: '#a78bfa',
  },
  FITNESS: {
    label: 'Fitness',
    icon: '🏋',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/15',
    border: 'border-emerald-400/40',
    hex: '#34d399',
  },
  FINANCE: {
    label: 'Finance',
    icon: '💰',
    color: 'text-amber-400',
    bg: 'bg-amber-400/15',
    border: 'border-amber-400/40',
    hex: '#fbbf24',
  },
  RELATIONSHIPS: {
    label: 'Relationships',
    icon: '🤝',
    color: 'text-rose-400',
    bg: 'bg-rose-400/15',
    border: 'border-rose-400/40',
    hex: '#fb7185',
  },
  PERSONAL: {
    label: 'Personal',
    icon: '✦',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-400/15',
    border: 'border-fuchsia-400/40',
    hex: '#e879f9',
  },
  CREATIVE: {
    label: 'Creative',
    icon: '🎨',
    color: 'text-orange-400',
    bg: 'bg-orange-400/15',
    border: 'border-orange-400/40',
    hex: '#fb923c',
  },
  TRAVEL: {
    label: 'Travel',
    icon: '✈',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/15',
    border: 'border-cyan-400/40',
    hex: '#22d3ee',
  },
  OTHER: {
    label: 'Other',
    icon: '○',
    color: 'text-slate-400',
    bg: 'bg-slate-400/15',
    border: 'border-slate-400/40',
    hex: '#94a3b8',
  },
}
