import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Life OS render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <ErrorFallback
          onRetry={() => this.setState({ hasError: false })}
        />
      )
    }
    return this.props.children
  }
}

interface ErrorFallbackProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorFallback({
  title = 'Something went wrong',
  message = 'Life OS hit an unexpected error. Try refreshing the page.',
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-8"
      role="alert"
    >
      <div className="max-w-md rounded-xl border border-border bg-surface p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-danger" aria-hidden />
        <h1 className="mt-4 text-lg font-medium">{title}</h1>
        <p className="mt-2 text-sm text-foreground-secondary">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          )}
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
      </div>
    </div>
  )
}

export function RouteErrorFallback() {
  return (
    <ErrorFallback
      title="Page unavailable"
      message="This page could not be loaded. Return to the dashboard or refresh."
    />
  )
}

export function DbErrorScreen() {
  return (
    <ErrorFallback
      title="Storage unavailable"
      message="Life OS could not access local storage on this device. Check browser settings and try again."
    />
  )
}
