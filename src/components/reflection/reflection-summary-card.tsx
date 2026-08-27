import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import type { ReflectionSummary } from '@/domain/reflection/build-reflection-summary'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, useMotionConfig } from '@/hooks/use-motion'

interface ReflectionSummaryCardProps {
  summary: ReflectionSummary
}

export function ReflectionSummaryCard({ summary }: ReflectionSummaryCardProps) {
  const { reducedMotion, initial } = useMotionConfig()

  return (
    <AnimatedCard elevated delay={0}>
      <motion.div
        variants={fadeUp}
        initial={initial}
        animate="visible"
        className="relative overflow-hidden"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-25"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 50%, transparent), transparent 70%)',
          }}
        />

        <div className="relative">
          <p className="text-xs font-semibold tracking-[0.35em] text-muted uppercase">
            {summary.weekLabel}
          </p>

          <motion.p
            className="mt-4 flex items-center gap-2 text-lg font-bold tracking-wide"
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-5 w-5 text-accent" aria-hidden />
            {summary.headline}
          </motion.p>

          <ul className="mt-6 space-y-2">
            {summary.stats.map((stat, i) => (
              <motion.li
                key={stat.label}
                className="flex items-baseline justify-between border-b border-border/40 pb-2 text-sm last:border-0"
                initial={reducedMotion ? false : { opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <span className="font-mono text-lg font-semibold">{stat.value}</span>
                <span className="text-foreground-secondary">{stat.label}</span>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Biggest win
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed">
                {summary.biggestWin}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest text-muted uppercase">
                Next focus
              </p>
              <p className="mt-2 text-sm leading-relaxed text-accent">
                {summary.nextFocus}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatedCard>
  )
}
