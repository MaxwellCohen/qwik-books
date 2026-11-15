import type { RequestHandler } from '@builder.io/qwik-city'
import { setRuntimeEnv } from '@/lib/runtime-env'

// Edge runtimes may not expose process.env; copy the bindings Qwik City hands us.
export const onRequest: RequestHandler = ({ env }) => {
  setRuntimeEnv((key) => env.get(key))
}
