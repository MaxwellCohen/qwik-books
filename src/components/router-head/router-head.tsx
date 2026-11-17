import { component$ } from '@builder.io/qwik'
import { useDocumentHead } from '@builder.io/qwik-city'

const description =
  'Browse two million Goodreads books with Qwik City, server-rendered search, and URL-driven filters.'

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((t==="system"||!t)&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`

export const RouterHead = component$(() => {
  const head = useDocumentHead()

  return (
    <>
      <title>{head.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#121212" media="(prefers-color-scheme: dark)" />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="Qwik Books" />
      <meta property="og:title" content="Qwik Books" />
      <meta property="og:type" content="website" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <script dangerouslySetInnerHTML={themeScript} />
      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}
      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}
      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML ? {} : { dangerouslySetInnerHTML: s.style })}
        />
      ))}
      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML ? {} : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  )
})
