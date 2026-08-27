import { motion } from 'framer-motion'
import { Download, Repeat, Swords, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { downloadBackup } from '@/lib/export/backup'
import { ROUTES } from '@/lib/constants'
import { useMotionConfig } from '@/hooks/use-motion'

interface QuickActionsProps {
  onNewQuest: () => void
  onNewGoal: () => void
  onNewHabit: () => void
}

const actions = [
  { id: 'quest', label: 'New Quest', icon: Swords, variant: 'primary' as const },
  { id: 'goal', label: 'New Goal', icon: Target, variant: 'secondary' as const },
  { id: 'habit', label: 'New Habit', icon: Repeat, variant: 'secondary' as const },
]

export function QuickActions({
  onNewQuest,
  onNewGoal,
  onNewHabit,
}: QuickActionsProps) {
  const navigate = useNavigate()
  const { reducedMotion } = useMotionConfig()

  const handlers: Record<string, () => void> = {
    quest: onNewQuest,
    goal: onNewGoal,
    habit: onNewHabit,
  }

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={reducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {actions.map(({ id, label, icon: Icon, variant }, i) => (
        <motion.div
          key={id}
          whileHover={reducedMotion ? undefined : { scale: 1.02 }}
          whileTap={reducedMotion ? undefined : { scale: 0.98 }}
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.05 }}
        >
          <Button variant={variant} size="sm" onClick={handlers[id]}>
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Button>
        </motion.div>
      ))}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => navigate(ROUTES.timeline)}
      >
        Activity
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => void downloadBackup()}
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </Button>
    </motion.div>
  )
}
