import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  htmlFor: string
  children: ReactNode
}

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground-secondary">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

export function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${inputClass} ${className}`} {...props} />
}

export function Textarea({
  className = '',
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`${inputClass} min-h-[80px] resize-y ${className}`}
      {...props}
    />
  )
}

export function Select({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputClass} ${className}`} {...props}>
      {children}
    </select>
  )
}
