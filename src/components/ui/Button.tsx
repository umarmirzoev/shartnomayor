import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none'

const variants: Record<Variant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 shadow-soft active:scale-[0.98]',
  secondary: 'bg-gold-500 text-ink-950 hover:bg-gold-400 shadow-soft active:scale-[0.98]',
  outline: 'border border-ink-200 text-ink-900 hover:border-ink-400 hover:bg-ink-50 active:scale-[0.98]',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
}

const sizes: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-[15px] px-6 py-3.5',
}

interface CommonProps {
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  className?: string
  children?: ReactNode
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined }
type LinkProps = CommonProps & { to: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>
type AnchorProps = CommonProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconRight, className, children, ...props },
  ref
) {
  return (
    <button ref={ref} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
      {iconRight}
    </button>
  )
})

export function ButtonLink({ variant = 'primary', size = 'md', icon, iconRight, className, children, to, ...props }: LinkProps) {
  return (
    <Link to={to} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
      {iconRight}
    </Link>
  )
}

export function ButtonAnchor({ variant = 'primary', size = 'md', icon, iconRight, className, children, href, ...props }: AnchorProps) {
  return (
    <a href={href} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {icon}
      {children}
      {iconRight}
    </a>
  )
}
