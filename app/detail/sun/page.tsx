import { fetchSun } from '@/lib/sun'
import { fetchWeeklyForecast } from '@/lib/forecast'
import { DetailHeader } from '@/components/layout/DetailHeader'

export default async function SunDetailPage() {
  const [sunResult, forecast] = await Promise.allSettled([
    fetchSun(),
    fetchWeeklyForecast(),
  ])

  const sun = sunResult.status === 'fulfilled' && sunResult.value.success
    ? sunResult.value.data : null
  const forecastData = forecast.status === 'fulfilled' ? forecast.value : []

  return (
    <div className="flex flex-col min-h-dvh bg-lake-50">
      <DetailHeader title="日の出・日の入り 詳細" />

      <main className="flex-1 px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* 今日 */}
        {sun && (
          <div className="card">
            <p className="card-label mb-3">今日</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="data-label text-amber-500">日の出</p>
                <p className="text-3xl font-bold text-slate-900 font-mono">{sun.sunrise}</p>
              </div>
              <div>
                <p className="data-label text-orange-500">日の入り</p>
                <p className="text-3xl font-bold text-slate-900 font-mono">{sun.sunset}</p>
              </div>
            </div>
          </div>
        )}

        {/* 1週間 */}
        {forecastData.length > 0 && (
          <div className="card">
            <p className="card-label mb-3">今後7日間</p>
            <div className="space-y-0">
              {forecastData.map((day, i) => (
                <div key={i} className={`flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0 ${i === 0 ? 'opacity-60' : ''}`}>
                  <p className={`text-sm font-semibold w-24 ${i === 0 ? 'text-slate-400' : 'text-slate-700'}`}>
                    {i === 0 ? '今日' : day.date}
                  </p>
                  <span className="text-lg">{day.weatherEmoji}</span>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-amber-500 font-semibold leading-none mb-0.5">日の出</p>
                      <p className="text-sm font-bold text-slate-900 font-mono">{day.sunrise}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-orange-500 font-semibold leading-none mb-0.5">日の入り</p>
                      <p className="text-sm font-bold text-slate-900 font-mono">{day.sunset}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">Open-Meteo Forecast API</p>
          <p className="text-xs text-slate-500 mt-1">api.open-meteo.com/v1/forecast（daily: sunrise, sunset）</p>
          <p className="text-xs text-slate-500">座標: 北緯35.0° / 東経135.9°</p>
          <p className="text-xs text-slate-500 mt-1">更新頻度: 日次（キャッシュ24時間）</p>
        </div>
      </main>
    </div>
  )
}
