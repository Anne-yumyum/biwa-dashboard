import Link from 'next/link'
import { fetchWeather, decodeWeatherCode } from '@/lib/weather'

export async function WeatherCard() {
  const result = await fetchWeather()
  if (!result.success) return (
    <div className="card">
      <p className="card-label">天気</p>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>取得できませんでした</p>
    </div>
  )

  const { weatherCode, tempMax, tempMin, precipitationProbability } = result.data
  const { label, emoji } = decodeWeatherCode(weatherCode)

  return (
    <Link href="/detail/weather" className="card" style={{ textDecoration: 'none' }}>
      <p className="card-label">天気 ›</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: 30, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
        <p style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{label}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>{tempMax}℃</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#2563eb' }}>{tempMin}℃</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="data-label">降水確率</p>
          <p style={{ fontSize: 26, fontWeight: 800, color: '#0369a1', lineHeight: 1 }}>
            {precipitationProbability}<span style={{ fontSize: 13, color: '#64748b', marginLeft: 1 }}>%</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
