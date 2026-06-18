import { fetchWeather, decodeWeatherCode } from '@/lib/weather'
import { fetchWeeklyForecast } from '@/lib/forecast'
import { DetailHeader } from '@/components/layout/DetailHeader'

export default async function WeatherDetailPage() {
  const [weatherResult, forecast] = await Promise.allSettled([
    fetchWeather(),
    fetchWeeklyForecast(),
  ])

  const weather = weatherResult.status === 'fulfilled' && weatherResult.value.success
    ? weatherResult.value.data : null
  const forecastData = forecast.status === 'fulfilled' ? forecast.value : []
  const { emoji, label } = weather ? decodeWeatherCode(weather.weatherCode) : { emoji: '?', label: '不明' }

  return (
    <div className="flex flex-col h-dvh bg-lake-50">
      <DetailHeader title="天気 詳細" />

      <main className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {weather ? (
          <div className="card">
            <p className="card-label mb-3">現在の天気</p>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{emoji}</span>
              <div>
                <p className="text-2xl font-bold text-slate-900">{label}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-sm text-red-500 font-semibold">最高 {weather.tempMax}℃</span>
                  <span className="text-sm text-sky-500 font-semibold">最低 {weather.tempMin}℃</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  降水確率 <span className="font-bold">{weather.precipitationProbability}%</span>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card"><p className="text-slate-400 text-sm">データ取得失敗</p></div>
        )}

        {forecastData.length > 0 && (
          <div className="card">
            <p className="card-label mb-3">10日間予報</p>
            <div className="space-y-2">
              {forecastData.map((day, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <p className={`text-sm font-semibold w-24 ${i === 0 ? 'text-lake-700' : 'text-slate-700'}`}>
                    {i === 0 ? '今日' : day.date}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{day.weatherEmoji}</span>
                    <span className="text-xs text-slate-500 w-16">{day.weatherLabel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-red-500 font-semibold">{day.tempMax}℃</span>
                    <span className="text-xs text-slate-400 mx-1">/</span>
                    <span className="text-xs text-sky-500 font-semibold">{day.tempMin}℃</span>
                    <p className="text-xs text-slate-500">☔{day.precipProbability}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">Open-Meteo Forecast API</p>
          <p className="text-xs text-slate-500 mt-1">api.open-meteo.com/v1/forecast</p>
          <p className="text-xs text-slate-500">座標: 北緯35.0° / 東経135.9°（琵琶湖中央付近）</p>
          <p className="text-xs text-slate-500 mt-1">更新頻度: 1時間ごと（キャッシュ10分）</p>
          <p className="text-xs text-slate-400 mt-1">無料・登録不要・WMO天気コード準拠</p>
        </div>
      </main>
    </div>
  )
}
