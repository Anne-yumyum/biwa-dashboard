import { DetailHeader } from '@/components/layout/DetailHeader'

const LAT = 35.0
const LON = 135.9

interface HourlyData {
  time: string[]
  temperature_2m: number[]
}

async function fetchHourlyTemperature() {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(LAT))
    url.searchParams.set('longitude', String(LON))
    url.searchParams.set('hourly', 'temperature_2m')
    url.searchParams.set('timezone', 'Asia/Tokyo')
    url.searchParams.set('forecast_days', '1')

    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const hourly = json.hourly as HourlyData

    return { success: true, data: hourly }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}

export default async function TemperatureDetailPage() {
  const result = await fetchHourlyTemperature()
  const hourly = result.success ? result.data : null

  let maxTemp = -Infinity
  let minTemp = Infinity
  let avgTemp = 0
  const hourlyData: Array<{ time: string; temp: number }> = []

  if (hourly) {
    let sum = 0
    hourly.temperature_2m.forEach((temp, i) => {
      maxTemp = Math.max(maxTemp, temp)
      minTemp = Math.min(minTemp, temp)
      sum += temp

      const timeStr = hourly.time[i]
      const hour = timeStr.slice(11, 13)
      hourlyData.push({ time: `${hour}:00`, temp: Math.round(temp * 10) / 10 })
    })
    avgTemp = Math.round((sum / hourly.temperature_2m.length) * 10) / 10
  }

  return (
    <div className="flex flex-col min-h-dvh bg-lake-50">
      <DetailHeader title="現在の気温" />

      <main className="flex-1 px-3 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {hourly ? (
          <>
            {/* サマリー */}
            <div className="card">
              <p className="card-label mb-3">本日の気温</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="data-label text-red-500">最高</p>
                  <p className="text-2xl font-bold text-slate-900">{maxTemp}℃</p>
                </div>
                <div>
                  <p className="data-label text-slate-600">平均</p>
                  <p className="text-2xl font-bold text-slate-900">{avgTemp}℃</p>
                </div>
                <div>
                  <p className="data-label text-sky-500">最低</p>
                  <p className="text-2xl font-bold text-slate-900">{minTemp}℃</p>
                </div>
              </div>
            </div>

            {/* 時間別気温 */}
            <div className="card">
              <p className="card-label mb-3">時間別気温</p>
              <div className="grid grid-cols-6 gap-2 text-center">
                {hourlyData.map((item, i) => (
                  <div key={i} className="p-2 rounded bg-slate-50">
                    <p className="text-xs text-slate-600 font-semibold">{item.time}</p>
                    <p className="text-sm font-bold text-slate-900 mt-1">{item.temp}℃</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card">
            <p className="text-slate-400 text-sm">データ取得失敗</p>
          </div>
        )}

        <div className="card bg-slate-50 border-slate-200">
          <p className="card-label mb-2">データソース</p>
          <p className="text-sm font-semibold text-slate-700">Open-Meteo Forecast API</p>
          <p className="text-xs text-slate-500 mt-1">api.open-meteo.com/v1/forecast（hourly: temperature_2m）</p>
          <p className="text-xs text-slate-500">座標: 北緯35.0° / 東経135.9°（琵琶湖中央付近）</p>
          <p className="text-xs text-slate-500 mt-1">更新頻度: 1時間ごと（キャッシュ10分）</p>
        </div>
      </main>
    </div>
  )
}
