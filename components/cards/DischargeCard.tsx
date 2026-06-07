import Link from 'next/link'
import { fetchDischarge } from '@/lib/discharge'

const EXTERNAL_URL = 'https://www.kkr.mlit.go.jp/biwako/index.html'

export async function DischargeCard() {
  const result = await fetchDischarge()

  if (!result.success) {
    return (
      <a href={EXTERNAL_URL} target="_blank" rel="noopener noreferrer"
        className="card" style={{ textDecoration: 'none', borderTop: '2px solid #f59e0b' }}>
        <p className="card-label">💧 放流量（瀬田川洗堰）</p>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#d97706', marginTop: 4 }}>タップして確認 ↗</p>
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>琵琶湖河川事務所</p>
      </a>
    )
  }

  return (
    <Link href="/detail/discharge" className="card"
      style={{ textDecoration: 'none', borderTop: '2px solid #0284c7' }}>
      <p className="card-label">💧 放流量（瀬田川洗堰）›</p>
      <div style={{ marginTop: 2 }}>
        <p className="data-value" style={{ fontSize: '1.8rem' }}>
          {result.data.current}<span className="data-unit">m³/s</span>
        </p>
      </div>
    </Link>
  )
}
