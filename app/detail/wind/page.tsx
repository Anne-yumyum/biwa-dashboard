import { fetchWeather, decodeWindDirection, windArrowRotation } from '@/lib/weather'
import { fetchWeeklyForecast, fetchHourlyWind } from '@/lib/forecast'
import { DetailHeader } from '@/components/layout/DetailHeader'

function WindArrow({ deg, size = 20, color = 'currentColor' }: { deg: number; size?: number; color?: string }) {
  const rotation = windArrowRotation(deg)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block', flexShrink: 0 }}>
      <line x1="16" y1="26" x2="16" y2="8" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <polyline points="9,15 16,6 23,15" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function windColor(speed: number) {
  if (speed < 3) return '#059669'
  if (speed < 4) return '#d97706'
  return '#dc2626'
}

function windStatus(speed: number) {
  if (speed < 2.5) return { label: 'イケる', color: 'text-emerald-600' }
  if (speed < 3.5) return { label: 'ヤバい', color: 'text-amber-600' }
  return { label: '死ぬで', color: 'text-red-600' }
}

export default async function WindDetailPage() {
  const [weatherResult, forecast, hourlyResult] = await Promise.allSettled([
    fetchWeather(),
    fetchWeeklyForecast(),
    fetchHourlyWind(),
  ])

  const weather = weatherResult.status === 'fulfilled' && weatherResult.value.success
    ? weatherResult.value.data : null
  const forecastData = forecast.status === 'fulfilled' ? forecast.value : []
  const hourly = hourlyResult.status === 'fulfilled' ? hourlyResult.value : []

  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title="風 詳細" />

      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">

        {/* 現在値 */}
        {weather ? (
          <div className="card">
            <p className="card-label mb-3">現在の風況</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="data-label">風速</p>
                <p className={`data-value ${windStatus(weather.windSpeed).color}`}>
                  {weather.windSpeed}<span className="data-unit">m/s</span>
                </p>
                <p className={`text-xs font-bold mt-1 ${windStatus(weather.windSpeed).color}`}>
                  {windStatus(weather.windSpeed).label}
                </p>
              </div>
              <div>
                <p className="data-label">最大瞬間</p>
                <p className="data-value">{weather.windGust}<span className="data-unit">m/s</span></p>
              </div>
              <div>
                <p className="data-label">風向</p>
                <WindArrow deg={weather.windDirection} size={32} color={windColor(weather.windSpeed)} />
                <p className="text-slate-600 text-sm font-medium mt-1">{decodeWindDirection(weather.windDirection)}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex gap-4 text-xs">
              <span className="text-emerald-600 font-semibold">〜2.4: イケる</span>
              <span className="text-amber-600 font-semibold">2.5〜3.4: ヤバい</span>
              <span className="text-red-600 font-semibold">3.5〜: 死ぬで</span>
            </div>
          </div>
        ) : (
          <div className="card"><p className="text-slate-400 text-sm">データ取得失敗</p></div>
        )}

        {/* 時間別風向（Windy風） */}
        {hourly.length > 0 && (
          <div className="card" style={{ padding: '10px 0', overflow: 'hidden' }}>
            <p className="card-label mb-3" style={{ paddingLeft: 12 }}>今日の時間別風況</p>

            {/* スクロール可能な横テーブル */}
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ borderCollapse: 'collapse', minWidth: '100%' }}>
                <thead>
                  <tr>
                    {hourly.map((h, i) => (
                      <td key={i} style={{
                        textAlign: 'center',
                        padding: '0 6px',
                        minWidth: 44,
                        fontSize: 10,
                        color: '#64748b',
                        fontWeight: 700,
                        borderBottom: '1px solid #e2e8f0',
                        paddingBottom: 4,
                      }}>{h.hour}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 風向矢印 */}
                  <tr>
                    {hourly.map((h, i) => (
                      <td key={i} style={{ textAlign: 'center', padding: '6px 0' }}>
                        <WindArrow deg={h.direction} size={18} color={windColor(h.speed)} />
                      </td>
                    ))}
                  </tr>
                  {/* 方位 */}
                  <tr>
                    {hourly.map((h, i) => (
                      <td key={i} style={{
                        textAlign: 'center',
                        fontSize: 9,
                        color: '#94a3b8',
                        fontWeight: 600,
                        paddingBottom: 4,
                      }}>{h.directionLabel}</td>
                    ))}
                  </tr>
                  {/* 風速 */}
                  <tr>
                    {hourly.map((h, i) => (
                      <td key={i} style={{
                        textAlign: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        color: windColor(h.speed),
                        paddingBottom: 2,
                        fontVariantNumeric: 'tabular-nums',
                      }}>{h.speed}</td>
                    ))}
                  </tr>
                  {/* 突風 */}
                  <tr>
                    {hourly.map((h, i) => (
                      <td key={i} style={{
                        textAlign: 'center',
                        fontSize: 9,
                        color: '#94a3b8',
                        paddingBottom: 6,
                        fontVariantNumeric: 'tabular-nums',
                      }}>{h.gust}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
              {/* 凡例 */}
              <div style={{ paddingLeft: 12, paddingBottom: 4, display: 'flex', gap: 12, fontSize: 9, color: '#94a3b8' }}>
                <span>↑ 風速 m/s</span>
                <span>下段: 突風 m/s</span>
              </div>
            </div>
          </div>
        )}

        {/* 週間風速予報 */}
        {forecastData.length > 0 && (
          <div className="card">
            <p className="card-label mb-3">10日間風速予報</p>
            <div className="space-y-0">
              {forecastData.map((day, i) => {
                const st = windStatus(day.windSpeedMax)
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <p className={`text-sm font-semibold w-20 ${i === 0 ? 'text-lake-700' : 'text-slate-700'}`}>
                      {i === 0 ? '今日' : day.date}
                    </p>
                    <div className="flex items-center gap-1">
                      <WindArrow deg={day.windDirection} size={18} color={windColor(day.windSpeedMax)} />
                      <span className="text-xs text-slate-400">{day.windDirectionLabel}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-bold ${st.color}`}>
                        {day.windSpeedMax}<span className="text-xs font-normal text-slate-400 ml-0.5">m/s</span>
                      </span>
                      <p className={`text-xs font-semibold ${st.color}`}>{st.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">Open-Meteo Forecast API</p>
          <p className="text-xs text-slate-500 mt-1">api.open-meteo.com/v1/forecast</p>
          <p className="text-xs text-slate-500">座標: 北緯35.0° / 東経135.9°（琵琶湖中央付近）</p>
          <p className="text-xs text-slate-500 mt-1">更新頻度: 1時間ごと（キャッシュ10分）</p>
        </div>
      </main>
    </div>
  )
}
