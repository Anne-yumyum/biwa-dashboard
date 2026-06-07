import Link from 'next/link'
import { fetchWeather, decodeWindDirection, windArrowRotation } from '@/lib/weather'
import { fetchWeeklyForecast } from '@/lib/forecast'

function WindArrow({ deg, size = 28 }: { deg: number; size?: number }) {
  const rotation = windArrowRotation(deg)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block', flexShrink: 0 }}>
      <line x1="16" y1="26" x2="16" y2="8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <polyline points="9,15 16,6 23,15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function windStatus(speed: number) {
  if (speed < 3) return { label: '出船OK', color: 'text-emerald-600' }
  if (speed < 4) return { label: '要注意', color: 'text-amber-600' }
  return { label: '出船取りやめ', color: 'text-red-600' }
}

export default async function WindDetailPage() {
  const [weatherResult, forecast] = await Promise.allSettled([
    fetchWeather(),
    fetchWeeklyForecast(),
  ])

  const weather = weatherResult.status === 'fulfilled' && weatherResult.value.success
    ? weatherResult.value.data : null
  const forecastData = forecast.status === 'fulfilled' ? forecast.value : []

  return (
    <div className="flex flex-col min-h-dvh bg-lake-50">
      {/* ヘッダー */}
      <header className="bg-lake-900 text-white px-4 pt-safe-top pb-3 flex items-center gap-3">
        <Link href="/" className="text-lake-300 text-2xl leading-none">‹</Link>
        <h1 className="text-base font-bold">風 詳細</h1>
      </header>

      <main className="flex-1 px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
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
                <WindArrow deg={weather.windDirection} size={32} />
                <p className="text-slate-600 text-sm font-medium mt-1">{decodeWindDirection(weather.windDirection)}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-1">出船基準（目安）</p>
              <div className="flex gap-4 text-xs">
                <span className="text-emerald-600 font-semibold">3m/s未満: 出船OK</span>
                <span className="text-amber-600 font-semibold">3〜4m/s: 要注意</span>
                <span className="text-red-600 font-semibold">4m/s以上: 取りやめ</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="card"><p className="text-slate-400 text-sm">データ取得失敗</p></div>
        )}

        {/* 週間予報 */}
        {forecastData.length > 0 && (
          <div className="card">
            <p className="card-label mb-3">週間風速予報</p>
            <div className="space-y-2">
              {forecastData.map((day, i) => {
                const st = windStatus(day.windSpeedMax)
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <p className={`text-sm font-semibold w-24 ${i === 0 ? 'text-lake-700' : 'text-slate-700'}`}>
                      {i === 0 ? '今日' : day.date}
                    </p>
                    <div className="flex items-center gap-2">
                      <WindArrow deg={day.windDirection} size={20} />
                      <span className="text-xs text-slate-500">{day.windDirectionLabel}</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-bold ${st.color}`}>
                        最大 {day.windSpeedMax}<span className="text-xs font-normal">m/s</span>
                      </p>
                      <p className={`text-xs font-semibold ${st.color}`}>{st.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* データソース */}
        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">Open-Meteo Forecast API</p>
          <p className="text-xs text-slate-500 mt-1">api.open-meteo.com/v1/forecast</p>
          <p className="text-xs text-slate-500">座標: 北緯35.0° / 東経135.9°（琵琶湖中央付近）</p>
          <p className="text-xs text-slate-500 mt-1">更新頻度: 1時間ごと（キャッシュ10分）</p>
          <p className="text-xs text-slate-400 mt-1">無料・登録不要・商用利用可</p>
        </div>
      </main>
    </div>
  )
}
