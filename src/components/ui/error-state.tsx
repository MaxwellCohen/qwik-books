import type { JSXChildren } from '@builder.io/qwik'
import { AlertTriangleIcon } from '@/components/icons'

type Props = {
  title?: string
  body?: string
  compact?: boolean
  children?: JSXChildren
}

export function ErrorState({ body, children, compact, title }: Props) {
  if (compact) {
    return (
      <div class="flex flex-col items-center gap-2 px-4 py-6 text-center">
        <AlertTriangleIcon class="text-danger size-4" />
        <p class="text-muted text-xs">{title ?? 'Something went wrong'}</p>
        {body ? <p class="text-muted text-xs leading-5">{body}</p> : null}
        {children}
      </div>
    )
  }

  return (
    <div class="grid flex-1 place-items-center px-6 py-20 text-center">
      <div class="flex max-w-sm flex-col items-center gap-3">
        <AlertTriangleIcon class="text-danger size-6" />
        <p class="text-sm font-medium text-black dark:text-white">{title ?? 'Something went wrong'}</p>
        {body ? <p class="text-muted text-sm leading-6">{body}</p> : null}
        {children}
      </div>
    </div>
  )
}
