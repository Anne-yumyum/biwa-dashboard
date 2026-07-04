import type { WeatherData, DataResult } from '@/types'

const LAT = 35.0
const LON = 135.9

// WMO weather code -> Japanese description + emoji
export function decodeWeatherCode(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: '快晴', emoji: '☀️' }
  if (code <= 2) return { label: '晴れ', emoji: '🌤️' }
  if (code === 3) return { label: '曇り', emoji: '☁️' }
  if (code <= 48) return { label: '霧', emoji: '🌫️' }
  if (code <= 57) return { label: '霧雨', emoji: '🌧️' }
  if (code <= 67) return { label: '雨', emoji: '🌧️' }
  if (code <= 77) return { label: '雪', emoji: '❄️' }
  if (code <= 82) return { label: 'にわか雨', emoji: '🌧️' }
  if (code <= 86) return { label: '雪のち雨', emoji: '🌨️' }
  if (code <= 99) return { label: '雷雨', emoji: '⛈️' }
  return { label: '不明', emoji: '❓' }
}

export function decodeWindDirection(deg: number): string {
  const dirs = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東',
                 '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西']
  const idx = Math.round(deg / 22.5) % 16
  return dirs[idx]
}

// wind direction in degrees (FROM) → rotation for a "↑" arrow pointing where wind GOES
export function windArrowRotation(deg: number): number {
  // deg=0: from North → blows South → arrow down → ↑ rotated 180°
  return (deg + 180) % 360
}

export function windDirectionArrow(deg: number): string {
  const arrows = ['↓','↙','←','↖','↑','↗','→','↘']
  const idx = Math.round(deg / 45) % 8
  return arrows[idx]
}

export async function fetchWeather(): Promise<DataResult<WeatherData>> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(LAT))
    url.searchParams.set('longitude', String(LON))
    url.searchParams.set('current', [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','))
    url.searchParams.set('daily', [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
    ].join(','))
    url.searchParams.set('timezone', 'Asia/Tokyo')
    url.searchParams.set('wind_speed_unit', 'ms')
    url.searchParams.set('forecast_days', '1')

    const res = await fetch(url.toString(), {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const json = await res.json()
    const c = json.current
    const d = json.daily

    return {
      success: true,
      data: {
        temperature: Math.round(c.temperature_2m * 10) / 10,
        feelsLike: Math.round(c.apparent_temperature * 10) / 10,
        weatherCode: c.weather_code,
        windSpeed: Math.round(c.wind_speed_10m * 10) / 10,
        windDirection: c.wind_direction_10m,
        windGust: Math.round(c.wind_gusts_10m * 10) / 10,
        tempMax: Math.round(d.temperature_2m_max[0] * 10) / 10,
        tempMin: Math.round(d.temperature_2m_min[0] * 10) / 10,
        precipitationProbability: d.precipitation_probability_max[0] ?? 0,
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
