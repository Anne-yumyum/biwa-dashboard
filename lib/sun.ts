import type { SunData, DataResult } from '@/types'

const LAT = 35.0
const LON = 135.9

function toJST(dateStr: string): string {
  return dateStr.slice(11, 16)
}

export async function fetchSun(): Promise<DataResult<SunData>> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(LAT))
    url.searchParams.set('longitude', String(LON))
    url.searchParams.set('daily', 'sunrise,sunset')
    url.searchParams.set('timezone', 'Asia/Tokyo')
    url.searchParams.set('forecast_days', '1')

    const res = await fetch(url.toString(), { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const d = json.daily

    return {
      success: true,
      data: {
        sunrise: toJST(d.sunrise[0]),
        sunset: toJST(d.sunset[0]),
        updatedAt: new Date().toLocaleTimeString('ja-JP', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Tokyo',
        }),
      },
    }
  } catch (e) {
    return { success: false, error: String(e) }
  }
}
