interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  label,
  className = '',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex justify-between text-xs text-foreground-secondary">
          <span>{label}</span>
          <span className="font-mono">{Math.round(percent)}%</span>
        </div>
      )}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
