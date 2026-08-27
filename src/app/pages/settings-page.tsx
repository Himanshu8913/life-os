import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Download,
  Upload,
  Trash2,
  Palette,
  Accessibility,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { AnimatedCard } from '@/components/ui/animated-card'
import { Button } from '@/components/ui/button'
import { reloadStores } from '@/db/hydrate'
import { downloadBackup, importAllData, resetAllData } from '@/lib/export/backup'
import { fadeUp, staggerContainer, useMotionConfig } from '@/hooks/use-motion'
import { useSettingsStore } from '@/stores/settings-store'

type ActionStatus = 'idle' | 'loading' | 'success' | 'error'

export function SettingsPage() {
  const { accentColor, reducedMotion, setAccentColor, setReducedMotion } =
    useSettingsStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { initial } = useMotionConfig()

  const [exportStatus, setExportStatus] = useState<ActionStatus>('idle')
  const [importStatus, setImportStatus] = useState<ActionStatus>('idle')
  const [resetStatus, setResetStatus] = useState<ActionStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  async function handleExport() {
    setExportStatus('loading')
    try {
      await downloadBackup()
      setExportStatus('success')
      setStatusMessage('Backup downloaded successfully.')
    } catch {
      setExportStatus('error')
      setStatusMessage('Export failed. Please try again.')
    }
  }

  async function handleImport(file: File) {
    setImportStatus('loading')
    try {
      const text = await file.text()
      const raw: unknown = JSON.parse(text)
      await importAllData(raw)
      await reloadStores()
      setImportStatus('success')
      setStatusMessage('Data imported and reloaded.')
    } catch (error) {
      setImportStatus('error')
      setStatusMessage(
        error instanceof Error ? error.message : 'Invalid backup file.',
      )
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        'Reset all Life OS data? This cannot be undone. Export a backup first.',
      )
    ) {
      return
    }
    setResetStatus('loading')
    try {
      await resetAllData()
      await reloadStores()
      setResetStatus('success')
      setStatusMessage('All data reset to defaults.')
    } catch {
      setResetStatus('error')
      setStatusMessage('Reset failed. Please try again.')
    }
  }

  function StatusIcon({ status }: { status: ActionStatus }) {
    if (status === 'loading') return <Loader2 className="h-4 w-4 animate-spin" />
    if (status === 'success') return <CheckCircle2 className="h-4 w-4 text-success" />
    if (status === 'error') return <AlertCircle className="h-4 w-4 text-danger" />
    return null
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Customize your Life OS experience and manage your data."
      />

      <motion.div
        className="space-y-4"
        variants={staggerContainer}
        initial={initial}
        animate="visible"
      >
        <AnimatedCard delay={0}>
          <motion.div variants={fadeUp}>
            <div className="mb-4 flex items-center gap-2">
              <Palette className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-medium">Appearance</h2>
            </div>
            <label className="block text-sm text-foreground-secondary" htmlFor="accent-color">
              Accent Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="accent-color"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent"
              />
              <span className="font-mono text-sm text-foreground-secondary">
                {accentColor}
              </span>
            </div>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard delay={0.05}>
          <motion.div variants={fadeUp}>
            <div className="mb-4 flex items-center gap-2">
              <Accessibility className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-medium">Accessibility</h2>
            </div>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              Reduce motion
            </label>
          </motion.div>
        </AnimatedCard>

        <AnimatedCard elevated delay={0.1}>
          <motion.div variants={fadeUp}>
            <h2 className="text-sm font-medium">Data Management</h2>
            <p className="mt-1 text-sm text-foreground-secondary">
              Your data never leaves this device. Export, import, or reset below.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => void handleExport()}
                disabled={exportStatus === 'loading'}
              >
                <Download className="h-4 w-4" />
                Export
                <StatusIcon status={exportStatus} />
              </Button>

              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={importStatus === 'loading'}
              >
                <Upload className="h-4 w-4" />
                Import
                <StatusIcon status={importStatus} />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleImport(file)
                  e.target.value = ''
                }}
              />

              <Button
                variant="ghost"
                onClick={() => void handleReset()}
                disabled={resetStatus === 'loading'}
                className="text-danger hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
                Reset Data
                <StatusIcon status={resetStatus} />
              </Button>
            </div>

            {statusMessage && (
              <motion.p
                className="mt-4 text-sm text-foreground-secondary"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {statusMessage}
              </motion.p>
            )}
          </motion.div>
        </AnimatedCard>
      </motion.div>
    </div>
  )
}
