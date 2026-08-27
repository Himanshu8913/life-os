import { create } from 'zustand'

export type CommandModal = 'quest' | 'goal' | 'habit'

interface CommandPaletteState {
  isOpen: boolean
  activeModal: CommandModal | null
  feedback: string | null
  open: () => void
  close: () => void
  toggle: () => void
  openModal: (modal: CommandModal) => void
  closeModal: () => void
  showFeedback: (message: string) => void
  clearFeedback: () => void
}

export const useCommandPaletteStore = create<CommandPaletteState>((set) => ({
  isOpen: false,
  activeModal: null,
  feedback: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  openModal: (activeModal) => set({ activeModal, isOpen: false }),
  closeModal: () => set({ activeModal: null }),
  showFeedback: (feedback) => set({ feedback }),
  clearFeedback: () => set({ feedback: null }),
}))
