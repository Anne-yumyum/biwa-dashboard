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
        <p style={{ fontSize: 14, fontWeight: 700, color: '#d97706', marginTop: 6 }}>タップして確認 ↗</p>
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>琵琶湖河川事務所</p>
      </a>
    )
  }

  return (
    <Link href="/detail/discharge" className="card"
      style={{ textDecoration: 'none', borderTop: '2px solid #0284c7' }}>
      <p className="card-label">💧 放流量（瀬田川）›</p>
      <div style={{ marginTop: 4 }}>
        <p className="data-label">現在</p>
        <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, marginTop: 2 }}>
          {result.data.current}<span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginLeft: 1 }}>m³/s</span>
        </p>
      </div>
    </Link>
  )
}
