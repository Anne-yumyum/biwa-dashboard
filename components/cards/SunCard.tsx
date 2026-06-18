import Link from 'next/link'
import { fetchSun } from '@/lib/sun'

export async function SunCard() {
  const result = await fetchSun()
  if (!result.success) return (
    <div className="card">
      <p className="card-label">☀️ 日の出・日の入り</p>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>取得できませんでした</p>
    </div>
  )

  const { sunrise, sunset } = result.data

  return (
    <Link href="/detail/sun" className="card" style={{ textDecoration: 'none' }}>
      <p className="card-label">☀️ 日の出・日の入り ›</p>
      <div style={{ marginTop: 4 }}>
        <p className="data-label" style={{ color: '#b45309' }}>日の出</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', fontFamily: 'monospace', lineHeight: 1 }}>
          {sunrise}
        </p>
      </div>
      <div style={{ marginTop: 4 }}>
        <p className="data-label" style={{ color: '#9a3412' }}>日の入り</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#9a3412', fontFamily: 'monospace', lineHeight: 1 }}>
          {sunset}
        </p>
      </div>
    </Link>
  )
}
