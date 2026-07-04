import { decodeWeatherCode, decodeWindDirection } from './weather'

export interface AreaWeather {
  windSpeed: number
  windGust: number
  windDirection: number
  windDirectionLabel: string
  temperature: number
  weatherCode: number
  weatherLabel: string
  weatherEmoji: string
  precipProbability: number
  tempMax: number
  tempMin: number
}

export async function fetchAreaWeather(lat: number, lon: number): Promise<AreaWeather | null> {
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast')
    url.searchParams.set('latitude', String(lat))
    url.searchParams.set('longitude', String(lon))
    url.searchParams.set('current', [
      'temperature_2m',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','))
    url.searchParams.set('daily', [
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
    ].join(','))
    url.searchParams.set('timezone', 'Asia/Tokyo')
    url.searchParams.set('wind_speed_unit', 'ms')
    url.searchParams.set('forecast_days', '1')

    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    if (!res.ok) return null
    const json = await res.json()
    const c = json.current
    const d = json.daily

    const { label, emoji } = decodeWeatherCode(c.weather_code)
    return {
      windSpeed: Math.round(c.wind_speed_10m * 10) / 10,
      windGust: Math.round(c.wind_gusts_10m * 10) / 10,
      windDirection: c.wind_direction_10m,
      windDirectionLabel: decodeWindDirection(c.wind_direction_10m),
      temperature: Math.round(c.temperature_2m * 10) / 10,
      weatherCode: c.weather_code,
      weatherLabel: label,
      weatherEmoji: emoji,
      precipProbability: d.precipitation_probability_max[0] ?? 0,
      tempMax: Math.round(d.temperature_2m_max[0] * 10) / 10,
      tempMin: Math.round(d.temperature_2m_min[0] * 10) / 10,
    }
  } catch {
    return null
  }
}
