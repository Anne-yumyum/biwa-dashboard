import { decodeWeatherCode, decodeWindDirection } from './weather'

const LAT = 35.0
const LON = 135.9

export interface DailyForecast {
  date: string        // MM/DD (曜日)
  weatherCode: number
  weatherLabel: string
  weatherEmoji: string
  tempMax: number
  tempMin: number
  precipProbability: number
  windSpeedMax: number
  windDirection: number
  windDirectionLabel: string
  sunrise: string     // HH:MM JST
  sunset: string      // HH:MM JST
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function toJST(dateStr: string): string {
  return dateStr.slice(11, 16)
}

export interface HourlyWind {
  hour: string       // HH:00
  speed: number      // m/s
  gust: number       // m/s
  direction: number  // degrees
  directionLabel: string
}

export async function fetchHourlyWind(): Promise<HourlyWind[]> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(LAT))
  url.searchParams.set('longitude', String(LON))
  url.searchParams.set('hourly', 'wind_speed_10m,wind_gusts_10m,wind_direction_10m')
  url.searchParams.set('timezone', 'Asia/Tokyo')
  url.searchParams.set('wind_speed_unit', 'ms')
  url.searchParams.set('forecast_days', '1')

  const res = await fetch(url.toString(), { next: { revalidate: 600 }, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const h = json.hourly

  return (h.time as string[]).map((t: string, i: number) => ({
    hour: t.slice(11, 16),
    speed: Math.round(h.wind_speed_10m[i] * 10) / 10,
    gust: Math.round(h.wind_gusts_10m[i] * 10) / 10,
    direction: h.wind_direction_10m[i],
    directionLabel: decodeWindDirection(h.wind_direction_10m[i]),
  }))
}

export async function fetchWeeklyForecast(): Promise<DailyForecast[]> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', String(LAT))
  url.searchParams.set('longitude', String(LON))
  url.searchParams.set('daily', [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_probability_max',
    'wind_speed_10m_max',
    'wind_direction_10m_dominant',
    'sunrise',
    'sunset',
  ].join(','))
  url.searchParams.set('timezone', 'Asia/Tokyo')
  url.searchParams.set('wind_speed_unit', 'ms')
  url.searchParams.set('forecast_days', '10')

  const res = await fetch(url.toString(), { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  const d = json.daily

  return (d.time as string[]).map((isoDate: string, i: number) => {
    const dt = new Date(isoDate + 'T00:00:00+09:00')
    const mm = String(dt.getMonth() + 1).padStart(2, '0')
    const dd = String(dt.getDate()).padStart(2, '0')
    const dow = WEEKDAYS[dt.getDay()]
    const { label, emoji } = decodeWeatherCode(d.weather_code[i])
    return {
      date: `${mm}/${dd}(${dow})`,
      weatherCode: d.weather_code[i],
      weatherLabel: label,
      weatherEmoji: emoji,
      tempMax: Math.round(d.temperature_2m_max[i] * 10) / 10,
      tempMin: Math.round(d.temperature_2m_min[i] * 10) / 10,
      precipProbability: d.precipitation_probability_max[i] ?? 0,
      windSpeedMax: Math.round(d.wind_speed_10m_max[i] * 10) / 10,
      windDirection: d.wind_direction_10m_dominant[i],
      windDirectionLabel: decodeWindDirection(d.wind_direction_10m_dominant[i]),
      sunrise: toJST(d.sunrise[i]),
      sunset: toJST(d.sunset[i]),
    }
  })
}
