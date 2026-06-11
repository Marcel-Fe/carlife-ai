import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-edge bg-card p-4 ${className}`}>{children}</div>
  )
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-semibold tracking-widest text-ink-soft uppercase">{children}</div>
  )
}

export function BigValue({ children }: { children: ReactNode }) {
  return <div className="mt-1 text-2xl font-bold tracking-tight">{children}</div>
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-night transition hover:brightness-110 active:scale-[0.98] disabled:opacity-40"
    >
      {children}
    </button>
  )
}

export function GhostButton({
  children,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-xl border border-edge px-5 py-2.5 text-sm font-semibold text-ink-soft transition hover:border-accent hover:text-ink"
    >
      {children}
    </button>
  )
}

const fieldClass =
  'w-full rounded-xl border border-edge bg-night px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent placeholder:text-ink-soft/60'

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldClass} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={fieldClass} />
}

export function EmptyState({
  icon,
  title,
  text,
  action,
}: {
  icon: ReactNode
  title: string
  text: string
  action?: ReactNode
}) {
  return (
    <div className="rise-in flex flex-col items-center gap-3 rounded-2xl border border-dashed border-edge px-6 py-14 text-center">
      <div className="text-accent">{icon}</div>
      <div className="text-lg font-bold">{title}</div>
      <p className="max-w-sm text-sm text-ink-soft">{text}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
