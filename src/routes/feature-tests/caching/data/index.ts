import type { RequestHandler } from '@builder.io/qwik-city'

let counter = 0

export const onGet: RequestHandler = ({ cacheControl, json }) => {
  cacheControl({ public: true, maxAge: 4, sMaxAge: 60, staleWhileRevalidate: 120 })
  counter += 1
  json(200, { counter, ts: Date.now() })
}
