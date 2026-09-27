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

export function ShareButtons({ text, lineUrl, compact = false }: { text: string; lineUrl: string; compact?: boolean }) {
  const [copied, setCopied] = useState<'ok' | 'ng' | null>(null)

  async function onCopy() {
    setCopied((await copyText(text)) ? 'ok' : 'ng')
    setTimeout(() => setCopied(null), 2000)
  }

  const pad = compact ? '8px 10px' : 12
  const fs = compact ? 12 : 14

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={onCopy} style={{
        flex: 1, padding: pad, borderRadius: 10, border: '1px solid #d0e4f0', background: '#fff',
        color: copied === 'ng' ? '#dc2626' : '#0f172a', fontWeight: 700, fontSize: fs, cursor: 'pointer',
      }}>
        {copied === 'ok' ? '✓ コピーしました' : copied === 'ng' ? 'コピー失敗' : '📋 コピー'}
      </button>
      <a href={lineUrl} target="_blank" rel="noopener noreferrer" style={{
        flex: 1, padding: pad, borderRadius: 10, background: '#06C755', color: '#fff',
        fontWeight: 700, fontSize: fs, textAlign: 'center', textDecoration: 'none',
      }}>
        LINEで送る
      </a>
    </div>
  )
}
