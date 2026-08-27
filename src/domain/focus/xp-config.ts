/** XP awarded when a focus session completes (PLAN §38). */
export const FOCUS_XP_DEFAULT = 50
export const FOCUS_XP_LONG = 100
export const FOCUS_LONG_MINUTES = 60

export function getFocusXp(minutes: number): number {
  return minutes >= FOCUS_LONG_MINUTES ? FOCUS_XP_LONG : FOCUS_XP_DEFAULT
}
