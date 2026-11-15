let reader: ((key: string) => string | undefined) | undefined

export function setRuntimeEnv(read: (key: string) => string | undefined) {
  reader = read
}

export function getEnv(key: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[key] : undefined
  return fromProcess ?? reader?.(key)
}
