import Link from 'next/link'
import { fetchWeather } from '@/lib/weather'

export async function TemperatureCard() {
  const result = await fetchWeather()
  if (!result.success) return (
    <div className="card">
      <p className="card-label">🌡️ 気温</p>
      <p style={{ color: '#94a3b8', fontSize: 12 }}>取得できませんでした</p>
    </div>
  )

  const { temperature, feelsLike } = result.data

  return (
    <Link href="/detail/temperature" className="card" style={{ textDecoration: 'none' }}>
      <p className="card-label">🌡️ 気温</p>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', marginTop: 4 }}>
        <div>
          <p className="data-label">現在</p>
          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
            {temperature}<span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', marginLeft: 1 }}>℃</span>
          </p>
        </div>
        <div>
          <p className="data-label">体感</p>
          <p style={{ fontSize: '1.3rem', fontWeight: 700, color: '#475569', lineHeight: 1 }}>
            {feelsLike}<span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', marginLeft: 1 }}>℃</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
