import { create } from 'zustand'
import type { Reflection } from '@/types'

interface ReflectionState {
  reflections: Reflection[]
  setReflections: (reflections: Reflection[]) => void
}

export const useReflectionStore = create<ReflectionState>((set) => ({
  reflections: [],
  setReflections: (reflections) => set({ reflections }),
}))
