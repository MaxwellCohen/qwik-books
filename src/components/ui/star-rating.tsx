import { StarIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

export function StarRating({ class: className, rating }: { class?: string; rating: number }) {
  const rounded = Math.round(rating * 2) / 2

  return (
    <span
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
      class={cn('inline-flex items-center gap-0.5', className)}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const filled = index + 1 <= rounded
        const half = !filled && index + 0.5 === rounded
        return (
          <StarIcon
            class={cn(
              'size-4',
              filled || half ? 'text-warning fill-current' : 'text-divider dark:text-divider-dark fill-current',
            )}
            key={index}
          />
        )
      })}
    </span>
  )
}
