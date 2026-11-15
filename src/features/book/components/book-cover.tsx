import { component$, useSignal } from '@builder.io/qwik'
import { thumbHashToDataURL } from 'thumbhash'
import { Skeleton } from '@/components/ui/skeleton'
import { EMPTY_IMAGE_URL, getLargeBookImageUrl } from '@/features/book/book-constants'
import { cn } from '@/lib/utils'

type Props = {
  class?: string
  priority?: boolean
  sizes: string
  src: string | null
  thumbhash: string | null
  title: string
}

function thumbhashUrl(hash: string | null) {
  if (!hash) return undefined
  try {
    const binary = atob(hash)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return thumbHashToDataURL(bytes)
  } catch {
    return undefined
  }
}

export const BookCover = component$<Props>((props) => {
  const resolved = getLargeBookImageUrl(props.src ?? EMPTY_IMAGE_URL)
  const failedSrc = useSignal<string | null>(null)
  const unavailable = failedSrc.value === resolved
  const placeholder = thumbhashUrl(props.thumbhash)

  return (
    <div class={cn('bg-card dark:bg-card-dark relative aspect-[2/3] w-full overflow-hidden rounded-md', props.class)}>
      {unavailable ? (
        <div
          aria-label={`Cover unavailable for ${props.title}`}
          class="text-muted absolute inset-0 flex items-center justify-center p-3 text-center text-sm"
          role="img"
        >
          Cover unavailable
        </div>
      ) : (
        <img
          alt={props.title}
          class="absolute inset-0 size-full object-cover"
          decoding="async"
          fetchPriority={props.priority ? 'high' : 'auto'}
          height={450}
          onError$={() => {
            failedSrc.value = resolved
          }}
          sizes={props.sizes}
          src={resolved}
          style={
            placeholder
              ? {
                  backgroundImage: `url("${placeholder}")`,
                  backgroundSize: 'cover',
                }
              : undefined
          }
          width={300}
        />
      )}
    </div>
  )
})

export function BookCoverSkeleton({ class: className }: { class?: string }) {
  return <Skeleton class={cn('skeleton-subtle aspect-[2/3] w-full rounded-md', className)} />
}
