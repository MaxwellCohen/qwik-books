import { $, Slot, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik'
import { MonitorIcon, MoonIcon, SunIcon } from '@/components/icons'
import { cn } from '@/lib/utils'

type Theme = 'dark' | 'light' | 'system'

export const ThemeToggle = component$<{ variant?: 'inline' | 'pill' }>(({ variant = 'pill' }) => {
  const active = useSignal<Theme | ''>('')

  // Read the stored preference once the page is ready (the inline head script already applied it).
  useVisibleTask$(
    () => {
      active.value = (localStorage.getItem('theme') as Theme | null) ?? 'system'
    },
    { strategy: 'document-ready' },
  )

  const setTheme = $((theme: Theme) => {
    active.value = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {}
    const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  })

  return (
    <div
      style={{ viewTransitionName: 'theme-toggle' }}
      class={
        variant === 'inline'
          ? 'inline-flex items-center gap-0.5'
          : 'border-divider dark:border-divider-dark inline-flex items-center rounded-full border p-0.5'
      }
    >
      <ToggleButton active={active.value === 'light'} label="Light mode" onClick$={() => setTheme('light')}>
        <SunIcon class="size-4" />
      </ToggleButton>
      <ToggleButton active={active.value === 'dark'} label="Dark mode" onClick$={() => setTheme('dark')}>
        <MoonIcon class="size-4" />
      </ToggleButton>
      <ToggleButton active={active.value === 'system'} label="System theme" onClick$={() => setTheme('system')}>
        <MonitorIcon class="size-4" />
      </ToggleButton>
    </div>
  )
})

const ToggleButton = component$<{ active: boolean; label: string; onClick$: () => void }>(
  ({ active, label, onClick$ }) => {
    return (
      <button
        aria-label={label}
        aria-pressed={active}
        class={cn(
          'rounded-full p-1.5 transition-colors',
          active
            ? 'bg-card dark:bg-card-dark text-black dark:text-white'
            : 'text-muted hover:text-black dark:hover:text-white',
        )}
        onClick$={onClick$}
        type="button"
      >
        <Slot />
      </button>
    )
  },
)
