import Link from 'next/link'

export function DepthMapCard() {
  return (
    <Link href="/detail/depth" className="card"
      style={{ textDecoration: 'none', borderTop: '2px solid #0369a1', flexShrink: 0 }}>
      <p className="card-label">🗺 琵琶湖 等深線 ›</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#0369a1', marginTop: 8 }}>湖沼図を見る</p>
      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>国土地理院 地理院地図</p>
    </Link>
  )
}
