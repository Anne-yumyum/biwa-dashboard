import Link from 'next/link'
import { fetchDischarge } from '@/lib/discharge'

const EXTERNAL_URL = 'https://www.kkr.mlit.go.jp/biwako/index.html'

export async function DischargeCard() {
  const result = await fetchDischarge()

  if (!result.success) {
    return (
      <a href={EXTERNAL_URL} target="_blank" rel="noopener noreferrer"
        className="card" style={{ textDecoration: 'none', borderTop: '2px solid #f59e0b' }}>
        <p className="card-label">💧 放流量（瀬田川）</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#d97706', marginTop: 8 }}>タップして確認 ↗</p>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>琵琶湖河川事務所</p>
      </a>
    )
  }

  return (
    <Link href="/detail/discharge" className="card"
      style={{ textDecoration: 'none', borderTop: '2px solid #0284c7' }}>
      <p className="card-label">💧 放流量（瀬田川）›</p>
      <div style={{ marginTop: 4 }}>
        <p className="data-label">現在</p>
        <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 2 }}>
          {result.data.current}<span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginLeft: 2 }}>m³/s</span>
        </p>
      </div>
    </Link>
  )
}
