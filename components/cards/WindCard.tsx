import Link from 'next/link'
import { fetchWeather, decodeWindDirection, windArrowRotation } from '@/lib/weather'

function windStatus(speed: number) {
  if (speed < 3) return { label: '出船OK',    cls: 'pill pill-ok',     arrowColor: '#059669', borderColor: '#059669' }
  if (speed < 4) return { label: '要注意',    cls: 'pill pill-warn',   arrowColor: '#d97706', borderColor: '#d97706' }
  return             { label: '出船取りやめ', cls: 'pill pill-danger', arrowColor: '#dc2626', borderColor: '#dc2626' }
}

function WindArrow({ deg, color }: { deg: number; color: string }) {
  const r = windArrowRotation(deg)
  return (
    <svg width="34" height="34" viewBox="0 0 32 32"
      style={{ transform: `rotate(${r}deg)`, flexShrink: 0, color }}>
      <line x1="16" y1="27" x2="16" y2="7" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <polyline points="8,14 16,5 24,14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export async function WindCard() {
  const result = await fetchWeather()
  if (!result.success) return (
    <div className="card" style={{ borderLeft: '3px solid #94a3b8' }}>
      <p className="card-label">🌬️ 風</p>
      <p style={{ color: '#94a3b8', fontSize: 12 }}>取得できませんでした</p>
    </div>
  )

  const { windSpeed, windGust, windDirection } = result.data
  const dir = decodeWindDirection(windDirection)
  const st = windStatus(windSpeed)

  return (
    <Link href="/detail/wind" className="card" style={{ borderLeft: `3px solid ${st.borderColor}`, textDecoration: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="card-label">🌬️ 風</p>
        <span className={st.cls}>{st.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
        <div>
          <p className="data-label">風速</p>
          <p className="data-value" style={{ fontSize: '2rem', color: st.borderColor }}>
            {windSpeed}<span className="data-unit">m/s</span>
          </p>
        </div>
        <div>
          <p className="data-label">最大瞬間</p>
          <p className="data-value" style={{ fontSize: '1.5rem' }}>
            {windGust}<span className="data-unit">m/s</span>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <WindArrow deg={windDirection} color={st.arrowColor} />
          <p style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>{dir}</p>
        </div>
      </div>
    </Link>
  )
}

export { WindArrow }
