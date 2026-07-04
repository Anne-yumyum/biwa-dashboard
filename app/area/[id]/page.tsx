import { notFound } from 'next/navigation'
import { getArea } from '@/lib/areas'
import { fetchAreaWeather } from '@/lib/areaWeather'
import { windArrowRotation } from '@/lib/weather'
import { DetailHeader } from '@/components/layout/DetailHeader'

function WindArrow({ deg, color, size = 40 }: { deg: number; color: string; size?: number }) {
  const r = windArrowRotation(deg)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ transform: `rotate(${r}deg)`, flexShrink: 0 }}>
      <line x1="16" y1="27" x2="16" y2="7" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <polyline points="8,14 16,5 24,14" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function windColor(speed: number) {
  if (speed < 2.5) return '#059669'
  if (speed < 3.5) return '#d97706'
  return '#dc2626'
}

function windLabel(speed: number) {
  if (speed < 2.5) return 'イケる'
  if (speed < 3.5) return 'ヤバい'
  return '死ぬで'
}

export default async function AreaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const area = getArea(id)
  if (!area) notFound()

  const weather = await fetchAreaWeather(area.lat, area.lon)

  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title={area.name} />

      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {weather ? (
          <>
            {/* 風況 */}
            <div className="card" style={{ borderLeft: `3px solid ${windColor(weather.windSpeed)}` }}>
              <p className="card-label mb-3">🌬️ 風況</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div>
                  <p className="data-label">風速</p>
                  <p style={{ fontSize: '2.4rem', fontWeight: 800, color: windColor(weather.windSpeed), lineHeight: 1 }}>
                    {weather.windSpeed}<span style={{ fontSize: 13, color: '#64748b', marginLeft: 2 }}>m/s</span>
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: windColor(weather.windSpeed), marginTop: 2 }}>
                    {windLabel(weather.windSpeed)}
                  </p>
                </div>
                <div>
                  <p className="data-label">最大瞬間</p>
                  <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#475569', lineHeight: 1 }}>
                    {weather.windGust}<span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 2 }}>m/s</span>
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <WindArrow deg={weather.windDirection} color={windColor(weather.windSpeed)} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{weather.windDirectionLabel}</p>
                </div>
              </div>
            </div>

            {/* 天気 */}
            <div className="card">
              <p className="card-label mb-3">🌤 天気</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 48 }}>{weather.weatherEmoji}</span>
                <div>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{weather.weatherLabel}</p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>最高 {weather.tempMax}℃</span>
                    <span style={{ color: '#94a3b8', margin: '0 6px' }}>/</span>
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>最低 {weather.tempMin}℃</span>
                  </p>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
                    降水確率 <span style={{ fontWeight: 700 }}>{weather.precipProbability}%</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 気温 */}
            <div className="card">
              <p className="card-label mb-2">🌡 現在の気温</p>
              <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                {weather.temperature}<span style={{ fontSize: 16, color: '#64748b', marginLeft: 2 }}>℃</span>
              </p>
            </div>
          </>
        ) : (
          <div className="card">
            <p style={{ color: '#94a3b8', fontSize: 14 }}>データ取得できませんでした</p>
          </div>
        )}

        {/* 座標情報 */}
        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">観測地点</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{area.name}</p>
          <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            {area.lat}°N, {area.lon}°E
          </p>
          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Open-Meteo Forecast API</p>
        </div>
      </main>
    </div>
  )
}
