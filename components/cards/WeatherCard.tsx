import Link from 'next/link'
import { fetchWeather, decodeWeatherCode } from '@/lib/weather'

export async function WeatherCard() {
  const result = await fetchWeather()
  if (!result.success) return (
    <div className="card">
      <p className="card-label">天気</p>
      <p style={{ color: '#94a3b8', fontSize: 12 }}>取得できませんでした</p>
    </div>
  )

  const { weatherCode, tempMax, tempMin, precipitationProbability } = result.data
  const { label, emoji } = decodeWeatherCode(weatherCode)

  return (
    <Link href="/detail/weather" className="card" style={{ textDecoration: 'none' }}>
      <p className="card-label">天気 ›</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <span style={{ fontSize: 26, lineHeight: 1 }}>{emoji}</span>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{label}</p>
          <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>{tempMax}℃</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#2563eb' }}>{tempMin}℃</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p className="data-label">降水確率</p>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#0369a1', lineHeight: 1 }}>
            {precipitationProbability}<span style={{ fontSize: 11, color: '#64748b' }}>%</span>
          </p>
        </div>
      </div>
    </Link>
  )
}
