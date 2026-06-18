import Link from 'next/link'
import { fetchLakeLevel } from '@/lib/lakeLevel'

const EXTERNAL_URL = 'http://www1.river.go.jp/cgi-bin/DspWaterData.exe?KIND=9&ID=306041286603280'

export async function LakeLevelCard() {
  const result = await fetchLakeLevel()

  if (!result.success) {
    return (
      <a href={EXTERNAL_URL} target="_blank" rel="noopener noreferrer"
        className="card" style={{ textDecoration: 'none', borderTop: '2px solid #f59e0b' }}>
        <p className="card-label">📊 琵琶湖水位</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#d97706', marginTop: 8 }}>タップして確認 ↗</p>
        <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>国土交通省 水文水質DB</p>
      </a>
    )
  }

  const { current, diffFromYesterday } = result.data
  const sign = current >= 0 ? '+' : ''
  const diffColor = diffFromYesterday === null ? '#64748b'
    : diffFromYesterday > 0 ? '#0369a1' : diffFromYesterday < 0 ? '#c2410c' : '#64748b'

  return (
    <Link href="/detail/lake-level" className="card"
      style={{ textDecoration: 'none', borderTop: '2px solid #0284c7' }}>
      <p className="card-label">📊 琵琶湖水位 ›</p>
      <div style={{ marginTop: 4 }}>
        <p className="data-label">現在水位 <span style={{ fontSize: 9, color: '#94a3b8' }}>BSL基準</span></p>
        <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
          {sign}{current}<span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginLeft: 2 }}>cm</span>
        </p>
      </div>
      {diffFromYesterday !== null && (
        <div style={{ marginTop: 4 }}>
          <p className="data-label">前日比</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: diffColor, lineHeight: 1 }}>
            {diffFromYesterday >= 0 ? '+' : ''}{diffFromYesterday}
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', marginLeft: 1 }}>cm</span>
          </p>
        </div>
      )}
    </Link>
  )
}
