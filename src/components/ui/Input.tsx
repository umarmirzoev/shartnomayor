import { forwardRef } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

const fieldClass = 'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-ink-500 focus:ring-4 focus:ring-ink-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-ink-500 dark:focus:border-ink-300 dark:focus:ring-white/10'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={clsx(fieldClass, className)} {...props} />
})

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={clsx(fieldClass, 'resize-none', className)} {...props} />
})

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={clsx(fieldClass, 'appearance-none bg-no-repeat', className)} {...props}>
      {children}
    </select>
  )
})

export function Field({ label, hint, children, required }: { label: string; hint?: string; children: ReactNode; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-800 dark:text-ink-200">
        {label} {required && <span className="text-gold-600 dark:text-gold-400">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink-400 dark:text-ink-500">{hint}</span>}
    </label>
  )
}
