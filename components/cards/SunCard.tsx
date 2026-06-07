import Link from 'next/link'
import { fetchSun } from '@/lib/sun'

export async function SunCard() {
  const result = await fetchSun()
  if (!result.success) return (
    <div className="card">
      <p className="card-label">☀️ 日の出・日の入り</p>
      <p style={{ color: '#94a3b8', fontSize: 12 }}>取得できませんでした</p>
    </div>
  )

  const { sunrise, sunset } = result.data

  return (
    <Link href="/detail/sun" className="card" style={{ textDecoration: 'none' }}>
      <p className="card-label">☀️ 日の出・日の入り ›</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginTop: 2 }}>
        <div>
          <p className="data-label" style={{ color: '#b45309' }}>日の出</p>
          <p className="data-value" style={{ fontSize: '1.5rem', color: '#b45309', fontFamily: 'monospace' }}>
            {sunrise}
          </p>
        </div>
        <div>
          <p className="data-label" style={{ color: '#9a3412' }}>日の入り</p>
          <p className="data-value" style={{ fontSize: '1.5rem', color: '#9a3412', fontFamily: 'monospace' }}>
            {sunset}
          </p>
        </div>
      </div>
    </Link>
  )
}
