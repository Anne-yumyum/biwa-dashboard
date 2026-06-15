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
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginTop: 2 }}>
        <div>
          <p className="data-label">現在</p>
          <p className="data-value">{temperature}<span className="data-unit">℃</span></p>
        </div>
        <div>
          <p className="data-label">体感</p>
          <p className="data-value" style={{ fontSize: '1.5rem', color: '#475569' }}>
            {feelsLike}<span className="data-unit">℃</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
