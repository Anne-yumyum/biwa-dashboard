'use client'
import { useState } from 'react'
import Link from 'next/link'
import { addMemo, memoToText, lineShareUrl, type Memo, type MemoConditions } from '@/lib/memo'
import { ShareButtons } from './ShareButtons'

const FISH = ['ビワマス', 'ブラックバス', 'ブルーギル', 'ニゴイ', 'その他']

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: 16,
  padding: '10px 12px',
  border: '1px solid #d0e4f0',
  borderRadius: 10,
  background: '#fff',
  color: '#0f172a',
}

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 4 }

type GpsState = { lat: number; lon: number } | 'loading' | 'denied' | null

export function MemoFab({ conditions }: { conditions: MemoConditions }) {
  const [open, setOpen] = useState(false)
  const [gps, setGps] = useState<GpsState>(null)
  const [spot, setSpot] = useState('')
  const [fish, setFish] = useState(FISH[0])
  const [count, setCount] = useState(1)
  const [size, setSize] = useState('')
  const [tackle, setTackle] = useState('')
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState<Memo | null>(null)
  const [error, setError] = useState('')

  function openSheet() {
    setOpen(true)
    setSaved(null)
    setError('')
    if (!navigator.geolocation) { setGps('denied'); return }
    setGps('loading')
    navigator.geolocation.getCurrentPosition(
      p => setGps({ lat: p.coords.latitude, lon: p.coords.longitude }),
      () => setGps('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  function close() {
    setOpen(false)
    if (saved) {
      setSpot(''); setCount(1); setSize(''); setTackle(''); setNote('')
      setSaved(null)
    }
  }

  function save() {
    if (count < 0) { setError('匹数は0以上で入力'); return }
    const memo: Memo = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      lat: typeof gps === 'object' && gps ? gps.lat : undefined,
      lon: typeof gps === 'object' && gps ? gps.lon : undefined,
      spot: spot.trim(), fish, count, size: size.trim(), tackle: tackle.trim(), note: note.trim(),
      conditions,
    }
    if (!addMemo(memo)) { setError('保存できませんでした（端末の容量を確認）'); return }
    setSaved(memo)
  }

  return (
    <>
      <button
        onClick={openSheet}
        aria-label="釣果メモを追加"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 'calc(max(6px, env(safe-area-inset-bottom)) + 62px)',
          width: 56, height: 56,
          borderRadius: 28,
          border: 'none',
          background: '#1a2b4b',
          color: '#fff',
          fontSize: 30,
          lineHeight: 1,
          boxShadow: '0 6px 16px rgba(26,43,75,0.35)',
          cursor: 'pointer',
          zIndex: 20,
        }}
      >＋</button>

      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 50, display: 'flex', alignItems: 'flex-end' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxHeight: '92dvh', overflowY: 'auto',
              background: '#f7f9fb', borderRadius: '18px 18px 0 0',
              padding: '10px 16px', paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
            }}
          >
            <div style={{ width: 36, height: 5, borderRadius: 3, background: '#cbd5e1', margin: '0 auto 10px' }} />

            {saved ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#059669', textAlign: 'center' }}>保存しました</p>
                <pre style={{
                  fontSize: 12, whiteSpace: 'pre-wrap', background: '#fff', border: '1px solid #d0e4f0',
                  borderRadius: 10, padding: 10, color: '#334155', fontFamily: 'inherit',
                }}>{memoToText(saved)}</pre>
                <ShareButtons text={memoToText(saved)} lineUrl={lineShareUrl(memoToText(saved))} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href="/memo" style={{ flex: 1, textAlign: 'center', padding: 12, borderRadius: 10, background: '#fff', border: '1px solid #1a2b4b', color: '#1a2b4b', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                    メモ一覧
                  </Link>
                  <button onClick={close} style={{ flex: 1, padding: 12, borderRadius: 10, background: '#1a2b4b', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14 }}>
                    閉じる
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a' }}>釣果メモ</p>
                  <Link href="/memo" style={{ fontSize: 13, fontWeight: 700, color: '#006399', textDecoration: 'none' }}>一覧 ›</Link>
                </div>

                <div style={{ fontSize: 11, color: '#475569', background: '#e8f2f8', borderRadius: 10, padding: '8px 10px', lineHeight: 1.6 }}>
                  <p>📍 {gps === 'loading' ? '位置を取得中…' : gps === 'denied' || gps === null ? '位置なし（許可されていません）' : `${gps.lat.toFixed(4)}, ${gps.lon.toFixed(4)}`}</p>
                  <p>🌬 {conditions.area}　{conditions.windDirection ?? ''} {conditions.windSpeed ?? '-'}m/s（突風{conditions.windGust ?? '-'}）　{conditions.weather ?? ''}</p>
                </div>

                <div>
                  <p style={labelStyle}>魚種</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {FISH.map(f => (
                      <button key={f} onClick={() => setFish(f)} style={{
                        padding: '8px 12px', borderRadius: 9999, fontSize: 13, fontWeight: 700,
                        border: f === fish ? '1px solid #1a2b4b' : '1px solid #d0e4f0',
                        background: f === fish ? '#1a2b4b' : '#fff',
                        color: f === fish ? '#fff' : '#475569',
                      }}>{f}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={labelStyle}>匹数</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button onClick={() => setCount(c => Math.max(0, c - 1))} style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid #d0e4f0', background: '#fff', fontSize: 22 }}>−</button>
                      <p style={{ flex: 1, textAlign: 'center', fontSize: 22, fontWeight: 800 }}>{count}</p>
                      <button onClick={() => setCount(c => c + 1)} style={{ width: 44, height: 44, borderRadius: 10, border: '1px solid #d0e4f0', background: '#fff', fontSize: 22 }}>＋</button>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={labelStyle}>サイズ (cm)</p>
                    <input inputMode="decimal" value={size} onChange={e => setSize(e.target.value)} placeholder="45" style={inputStyle} />
                  </div>
                </div>

                <div>
                  <p style={labelStyle}>スポット名</p>
                  <input value={spot} onChange={e => setSpot(e.target.value)} placeholder="沖島北 水深30m" style={inputStyle} />
                </div>
                <div>
                  <p style={labelStyle}>ルアー・タナ</p>
                  <input value={tackle} onChange={e => setTackle(e.target.value)} placeholder="スプーン赤金 / 25m" style={inputStyle} />
                </div>
                <div>
                  <p style={labelStyle}>メモ</p>
                  <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="朝マズメ、潮目で連発" style={{ ...inputStyle, resize: 'none' }} />
                </div>

                {error && <p style={{ fontSize: 13, color: '#dc2626' }}>{error}</p>}

                <button onClick={save} style={{
                  padding: 14, borderRadius: 12, border: 'none', background: '#1a2b4b', color: '#fff',
                  fontSize: 16, fontWeight: 800, cursor: 'pointer',
                }}>保存</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
