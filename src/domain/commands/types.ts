export type ParsedCommand =
  | { kind: 'complete-quest'; title: string }
  | { kind: 'log-habit'; name: string }
  | { kind: 'mood'; label: string }
  | { kind: 'focus'; minutes: number; title?: string }
  | { kind: 'activity'; activity: 'workout' | 'reading'; minutes: number }
  | { kind: 'navigate'; destination: string }
  | { kind: 'action'; action: 'add-quest' | 'add-goal' | 'add-habit' | 'export' }
