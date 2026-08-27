import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { motion } from 'framer-motion'
import type { ObservatoryMetrics } from '@/domain/analytics/calculate-observatory-metrics'
import { AnimatedCard } from '@/components/ui/animated-card'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'

const CHART_COLORS = [
  'var(--color-accent)',
  'color-mix(in srgb, var(--color-accent) 70%, white)',
  'color-mix(in srgb, var(--color-accent) 45%, white)',
  'color-mix(in srgb, var(--color-success) 80%, transparent)',
  'color-mix(in srgb, var(--color-muted) 60%, var(--color-accent))',
]

const tooltipStyle = {
  backgroundColor: 'var(--color-surface-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: '8px',
  fontSize: '12px',
}

interface ObservatoryChartsProps {
  metrics: ObservatoryMetrics
}

function ChartCard({
  title,
  children,
  delay,
}: {
  title: string
  children: ReactNode
  delay: number
}) {
  return (
    <AnimatedCard delay={delay} elevated>
      <motion.div variants={fadeUp}>
        <p className="mb-4 text-xs font-medium tracking-widest text-muted uppercase">
          {title}
        </p>
        {children}
      </motion.div>
    </AnimatedCard>
  )
}

export function ObservatoryCharts({ metrics }: ObservatoryChartsProps) {
  const { initial } = useMotionConfig()

  return (
    <motion.div
      className="grid gap-4 lg:grid-cols-2"
      variants={staggerContainer}
      initial={initial}
      animate="visible"
    >
      <ChartCard title="Weekly activity" delay={0}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={metrics.weeklyActivity}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly activity" delay={0.05}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={metrics.monthlyActivity}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="color-mix(in srgb, var(--color-accent) 75%, white)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Activity by day" delay={0.1}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={metrics.activityByDayOfWeek}>
            <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fill: 'var(--color-muted)', fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="XP by category" delay={0.15}>
        {metrics.xpByCategory.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">Complete quests to see XP breakdown.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={metrics.xpByCategory}
                dataKey="xp"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {metrics.xpByCategory.map((_, index) => (
                  <Cell
                    key={index}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </motion.div>
  )
}
