import type { PropsOf } from '@builder.io/qwik'
import { cn } from '@/lib/utils'

type Size = 'default' | 'sm'

const base =
  'text-muted hover:bg-card focus-visible:ring-accent/40 dark:hover:bg-card-dark inline-flex shrink-0 items-center justify-center rounded-md transition-colors hover:text-black focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-white'

const sizes: Record<Size, string> = {
  default: 'size-8',
  sm: 'size-7',
}

type Props = PropsOf<'button'> & { label: string; size?: Size }

export function IconButton({ children, class: className, label, size = 'default', type = 'button', ...props }: Props) {
  return (
    <button aria-label={label} class={cn(base, sizes[size], className as string | undefined)} type={type} {...props}>
      {children}
    </button>
  )
}
