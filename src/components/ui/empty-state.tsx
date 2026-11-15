import type { JSXChildren } from '@builder.io/qwik'
import { BookMark } from '@/components/book-mark'

type Props = {
  title: string
  body?: string
  children?: JSXChildren
}

export function EmptyState({ body, children, title }: Props) {
  return (
    <div class="grid flex-1 place-items-center px-6 py-20 text-center">
      <div class="flex max-w-sm flex-col items-center gap-3">
        <BookMark animated class="mb-1 size-10" />
        <p class="text-sm font-medium">{title}</p>
        {body ? <p class="text-muted text-sm leading-6">{body}</p> : null}
        {children}
      </div>
    </div>
  )
}
