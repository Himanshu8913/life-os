import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { springSnappy } from '@/hooks/use-motion'
import { useSettingsStore } from '@/stores/settings-store'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-vivid text-white hover:opacity-90 border-transparent shadow-[0_4px_24px_color-mix(in_srgb,var(--color-violet)_45%,transparent)]',
  secondary:
    'bg-surface-elevated text-foreground hover:bg-surface-elevated/80 border-border',
  ghost:
    'bg-transparent text-foreground-secondary hover:text-foreground hover:bg-surface-elevated border-transparent',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
}

const MotionButton = motion.button

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion)

  return (
    <MotionButton
      type="button"
      disabled={disabled}
      whileHover={
        reducedMotion || disabled ? undefined : { scale: 1.02, y: -1 }
      }
      whileTap={reducedMotion || disabled ? undefined : { scale: 0.97 }}
      transition={springSnappy}
      className={`inline-flex items-center justify-center gap-2 border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </MotionButton>
  )
}
