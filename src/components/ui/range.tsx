import { component$, useSignal, useTask$, type QRL } from '@builder.io/qwik'

type Props = {
  id: string
  label: string
  value: number
  values: readonly number[]
  // One display string per entry in `values` (functions are not serializable props).
  readouts: readonly string[]
  hint?: readonly [string, string]
  onValueChange$: QRL<(value: number) => void>
}

function closestIndex(values: readonly number[], value: number) {
  return values.reduce(
    (closest, option, index) => (Math.abs(option - value) < Math.abs(values[closest] - value) ? index : closest),
    0,
  )
}

export const Range = component$<Props>((props) => {
  const selected = useSignal(closestIndex(props.values, props.value))

  useTask$(({ track }) => {
    const value = track(() => props.value)
    selected.value = closestIndex(props.values, value)
  })

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-baseline justify-between gap-2">
        <label class="text-muted text-xs font-semibold tracking-wide uppercase" for={props.id}>
          {props.label}
        </label>
        <span class="text-sm font-medium text-black tabular-nums dark:text-white">
          {props.readouts[selected.value]}
        </span>
      </div>
      <input
        class="focus-visible:ring-accent/30 cursor-pointer rounded-full focus-visible:ring-2 focus-visible:outline-none"
        id={props.id}
        max={props.values.length - 1}
        min={0}
        onInput$={(_, el) => {
          selected.value = Number(el.value)
        }}
        onChange$={(_, el) => props.onValueChange$(props.values[Number(el.value)])}
        step={1}
        type="range"
        value={selected.value}
      />
      {props.hint ? (
        <div class="text-muted flex justify-between text-[11px] tabular-nums">
          <span>{props.hint[0]}</span>
          <span>{props.hint[1]}</span>
        </div>
      ) : null}
    </div>
  )
})
