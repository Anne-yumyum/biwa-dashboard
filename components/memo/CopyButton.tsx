'use client'
import { useState } from 'react'

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}

export function CopyButton({ text, compact = false }: { text: string; compact?: boolean }) {
  const [copied, setCopied] = useState<'ok' | 'ng' | null>(null)

  async function onCopy() {
    setCopied((await copyText(text)) ? 'ok' : 'ng')
    setTimeout(() => setCopied(null), 2000)
  }

  const pad = compact ? '8px 10px' : 12
  const fs = compact ? 12 : 14

  return (
    <button onClick={onCopy} style={{
      width: '100%', padding: pad, borderRadius: 10,
      border: copied === 'ok' ? '1px solid #059669' : '1px solid #1a2b4b',
      background: copied === 'ok' ? '#e6f4ea' : '#fff',
      color: copied === 'ng' ? '#dc2626' : copied === 'ok' ? '#059669' : '#1a2b4b',
      fontWeight: 700, fontSize: fs, cursor: 'pointer',
    }}>
      {copied === 'ok' ? '✓ コピーしました' : copied === 'ng' ? 'コピー失敗' : '📋 テキストをコピー'}
    </button>
  )
}
