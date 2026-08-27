import { describe, expect, it } from 'vitest'
import {
  parseCommand,
  parseMoodValue,
  resolveNavigationDestination,
} from '@/domain/commands/parse-command'

describe('parseCommand', () => {
  it('parses complete quest with quotes', () => {
    expect(parseCommand('complete "Build MVP"')).toEqual({
      kind: 'complete-quest',
      title: 'Build MVP',
    })
  })

  it('parses complete quest without quotes', () => {
    expect(parseCommand('complete Build MVP')).toEqual({
      kind: 'complete-quest',
      title: 'Build MVP',
    })
  })

  it('parses mood', () => {
    expect(parseCommand('mood happy')).toEqual({
      kind: 'mood',
      label: 'happy',
    })
  })

  it('parses focus session with duration', () => {
    expect(parseCommand('focus 50m')).toEqual({
      kind: 'focus',
      minutes: 50,
      title: undefined,
    })
  })

  it('parses start focus with title', () => {
    expect(parseCommand('focus 50m build project')).toEqual({
      kind: 'focus',
      minutes: 50,
      title: 'build project',
    })
  })

  it('parses workout activity', () => {
    expect(parseCommand('workout 45m')).toEqual({
      kind: 'activity',
      activity: 'workout',
      minutes: 45,
    })
  })

  it('parses reading activity', () => {
    expect(parseCommand('read 30m')).toEqual({
      kind: 'activity',
      activity: 'reading',
      minutes: 30,
    })
  })

  it('parses add quest', () => {
    expect(parseCommand('add quest')).toEqual({
      kind: 'action',
      action: 'add-quest',
    })
  })

  it('parses log habit', () => {
    expect(parseCommand('log habit Morning Run')).toEqual({
      kind: 'log-habit',
      name: 'Morning Run',
    })
  })

  it('parses navigation', () => {
    expect(parseCommand('open timeline')).toEqual({
      kind: 'navigate',
      destination: 'timeline',
    })
  })

  it('parses export', () => {
    expect(parseCommand('export data')).toEqual({
      kind: 'action',
      action: 'export',
    })
  })

  it('returns null for unrecognized input', () => {
    expect(parseCommand('random gibberish')).toBeNull()
  })
})

describe('parseMoodValue', () => {
  it('maps labels to scale', () => {
    expect(parseMoodValue('happy')).toBe(4)
    expect(parseMoodValue('3')).toBe(3)
  })

  it('returns null for unknown labels', () => {
    expect(parseMoodValue('purple')).toBeNull()
  })
})

describe('resolveNavigationDestination', () => {
  it('resolves aliases', () => {
    expect(resolveNavigationDestination('home')).toBe('dashboard')
    expect(resolveNavigationDestination('activity')).toBe('timeline')
  })
})
