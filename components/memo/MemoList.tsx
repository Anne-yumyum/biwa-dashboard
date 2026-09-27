'use client'
import { useEffect, useRef, useState } from 'react'
import {
  loadMemos, deleteMemo, importMemos, memoToText, lineShareUrl, formatDateTime, type Memo,
} from '@/lib/memo'
import { ShareButtons } from './ShareButtons'

export function MemoList() {
  const [memos, setMemos] = useState<Memo[] | null>(null)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setMemos(loadMemos()) }, [])

  function remove(id: string) {
    if (!confirm('このメモを削除しますか？')) return
    deleteMemo(id)
    setMemos(loadMemos())
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(loadMemos(), null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `biwamasu-memo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!Array.isArray(data)) throw new Error()
      const n = importMemos(data)
      setMemos(loadMemos())
      setMsg(`${n}件 取り込みました`)
    } catch {
      setMsg('ファイルを読めませんでした')
    }
    e.target.value = ''
  }

  if (memos === null) return <p style={{ color: '#94a3b8', textAlign: 'center', padding: 24 }}>読み込み中…</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={exportJson} disabled={memos.length === 0} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #d0e4f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#1a2b4b' }}>
          ⬇ バックアップ保存
        </button>
        <button onClick={() => fileRef.current?.click()} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #d0e4f0', background: '#fff', fontSize: 13, fontWeight: 700, color: '#1a2b4b' }}>
          ⬆ バックアップ読込
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onImport} style={{ display: 'none' }} />
      </div>
      {msg && <p style={{ fontSize: 12, color: '#475569', textAlign: 'center' }}>{msg}</p>}

      {memos.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>最初の釣果を記録しよう</p>
          <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>ホーム画面右下の ＋ から保存できます。</p>
        </div>
      )}

      {memos.map(m => {
        const c = m.conditions
        return (
          <div key={m.id} className="card" style={{ gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <p style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{formatDateTime(m.createdAt)}・{c.area}</p>
              <button onClick={() => remove(m.id)} aria-label="削除" style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: 12 }}>削除</button>
            </div>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
              {m.fish} {m.count}匹{m.size ? ` / ${m.size}cm` : ''}
            </p>
            <p style={{ fontSize: 13, color: '#334155' }}>
              📍 {m.spot || 'スポット未入力'}
              {m.lat !== undefined && m.lon !== undefined && (
                <a href={`https://maps.google.com/?q=${m.lat},${m.lon}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6, color: '#006399', fontSize: 12 }}>地図 ↗</a>
              )}
            </p>
            {m.tackle && <p style={{ fontSize: 13, color: '#334155' }}>🎣 {m.tackle}</p>}
            <p style={{ fontSize: 12, color: '#64748b' }}>
              🌬 {c.windDirection ?? ''} {c.windSpeed ?? '-'}m/s（突風{c.windGust ?? '-'}）{c.weather ? `・${c.weather}` : ''}{c.temperature !== undefined ? ` ${c.temperature}℃` : ''}
            </p>
            {(c.tideHigh || c.tideLow) && <p style={{ fontSize: 12, color: '#64748b' }}>🌊 満潮{c.tideHigh ?? '-'} / 干潮{c.tideLow ?? '-'}</p>}
            {m.note && <p style={{ fontSize: 13, color: '#334155' }}>📝 {m.note}</p>}
            <div style={{ marginTop: 4 }}>
              <ShareButtons compact text={memoToText(m)} lineUrl={lineShareUrl(memoToText(m))} />
            </div>
          </div>
        )
      })}

      <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
        メモはこの端末内にのみ保存されます。<br />機種変更前にバックアップ保存してください。
      </p>
    </div>
  )
}
