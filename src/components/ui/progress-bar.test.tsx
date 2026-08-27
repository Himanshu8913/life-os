import { describe, expect, it } from 'vitest'
import { ProgressBar } from '@/components/ui/progress-bar'
import { render, screen } from '@testing-library/react'

describe('ProgressBar', () => {
  it('renders with correct percentage', () => {
    render(<ProgressBar value={50} max={100} label="XP" />)
    expect(screen.getByText('50%')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('clamps value between 0 and 100 percent', () => {
    render(<ProgressBar value={150} max={100} />)
    const bar = screen.getByRole('progressbar')
    expect(bar.querySelector('div')).toHaveStyle({ width: '100%' })
  })
})
