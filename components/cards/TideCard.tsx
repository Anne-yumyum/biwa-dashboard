import Link from 'next/link'
import { calculateTides } from '@/lib/tide'

export function TideCard() {
  const result = calculateTides(new Date())
  if (!result.success) return (
    <div className="card"><p className="card-label">🌊 潮汐</p></div>
  )

  const entries = result.data.entries
  const highs = entries.filter(e => e.type === 'high').slice(0, 2)
  const lows  = entries.filter(e => e.type === 'low').slice(0, 2)

  return (
    <Link href="/detail/tide" className="card" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="card-label">🌊 潮汐 ›</p>
        <span style={{ fontSize: 9, color: '#94a3b8' }}>敦賀港参考</span>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
        <div>
          <p className="data-label" style={{ color: '#1d4ed8' }}>満潮</p>
          {highs.map((e, i) => (
            <p key={i} style={{ fontSize: 13, fontWeight: 800, color: '#1e40af', fontFamily: 'monospace', lineHeight: 1.4 }}>{e.time}</p>
          ))}
        </div>
        <div>
          <p className="data-label" style={{ color: '#c2410c' }}>干潮</p>
          {lows.map((e, i) => (
            <p key={i} style={{ fontSize: 13, fontWeight: 800, color: '#9a3412', fontFamily: 'monospace', lineHeight: 1.4 }}>{e.time}</p>
          ))}
        </div>
      </div>
    </Link>
  )
}
