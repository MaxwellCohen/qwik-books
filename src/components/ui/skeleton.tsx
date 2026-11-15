import { cn } from '@/lib/utils'

export function Skeleton({ class: className }: { class?: string }) {
  return <span aria-hidden="true" class={cn('skeleton-animation block', className)} />
}
