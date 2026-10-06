import { useState, useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-markup-templating'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-json'

function escapeCopyFallback(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

export default function CodeBlock({ label = 'code.php', lang = 'php', code }) {
  const [copied, setCopied] = useState(false)

  const html = useMemo(() => {
    const grammar = Prism.languages[lang] || Prism.languages.clike
    return Prism.highlight(code.trim(), grammar, lang)
  }, [code, lang])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
    } catch {
      escapeCopyFallback(code.trim())
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <figure className="codeblock">
      <figcaption className="codeblock__bar">
        <span className="codeblock__dots" aria-hidden="true">
          <i /><i /><i />
        </span>
        <span className="codeblock__label">{label}</span>
        <span className="codeblock__lang">{lang}</span>
        <button
          type="button"
          className={`codeblock__copy ${copied ? 'is-copied' : ''}`}
          onClick={copy}
          aria-label={`Copy ${label} to clipboard`}
        >
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
      </figcaption>
      <pre className="codeblock__pre" tabIndex={0}>
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  )
}
