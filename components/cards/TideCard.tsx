import Link from 'next/link'
import { calculateTides } from '@/lib/tide'

export function TideCard() {
  const result = calculateTides(new Date())
  if (!result.success) return (
    <div className="card"><p className="card-label">🌊 潮汐</p></div>
  )

  const entries = result.data.entries
  const high = entries.find(e => e.type === 'high')
  const low  = entries.find(e => e.type === 'low')

  return (
    <Link href="/detail/tide" className="card" style={{ textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="card-label">🌊 潮汐 ›</p>
        <span style={{ fontSize: 10, color: '#94a3b8' }}>敦賀港参考</span>
      </div>
      <div style={{ marginTop: 4 }}>
        <p className="data-label" style={{ color: '#1d4ed8' }}>満潮</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e40af', fontFamily: 'monospace', lineHeight: 1 }}>
          {high?.time ?? '--:--'}
        </p>
      </div>
      <div style={{ marginTop: 4 }}>
        <p className="data-label" style={{ color: '#c2410c' }}>干潮</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#9a3412', fontFamily: 'monospace', lineHeight: 1 }}>
          {low?.time ?? '--:--'}
        </p>
      </div>
    </Link>
  )
}
