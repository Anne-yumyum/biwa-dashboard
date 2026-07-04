import Link from 'next/link'
import { fetchWeather, decodeWindDirection, windArrowRotation } from '@/lib/weather'

function windStatus(speed: number) {
  if (speed < 2.5) return { label: 'イケる',  cls: 'pill pill-ok',     arrowColor: '#059669', borderColor: '#059669' }
  if (speed < 3.5) return { label: 'ヤバい',  cls: 'pill pill-warn',   arrowColor: '#d97706', borderColor: '#d97706' }
  return             { label: '死ぬで',       cls: 'pill pill-danger', arrowColor: '#dc2626', borderColor: '#dc2626' }
}

function WindArrow({ deg, color }: { deg: number; color: string }) {
  const r = windArrowRotation(deg)
  return (
    <svg width="44" height="44" viewBox="0 0 32 32"
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
      <p style={{ color: '#94a3b8', fontSize: 13 }}>取得できませんでした</p>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 6 }}>
        <div>
          <p className="data-label">風速</p>
          <p style={{ fontSize: '2.6rem', fontWeight: 800, color: st.borderColor, lineHeight: 1 }}>
            {windSpeed}<span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginLeft: 2 }}>m/s</span>
          </p>
        </div>
        <div>
          <p className="data-label">最大瞬間</p>
          <p style={{ fontSize: '1.9rem', fontWeight: 800, color: '#475569', lineHeight: 1 }}>
            {windGust}<span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', marginLeft: 2 }}>m/s</span>
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <WindArrow deg={windDirection} color={st.arrowColor} />
          <p style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{dir}</p>
        </div>
      </div>
    </Link>
  )
}

export { WindArrow }
