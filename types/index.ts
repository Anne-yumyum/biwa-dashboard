export interface WeatherData {
  temperature: number
  feelsLike: number
  weatherCode: number
  windSpeed: number
  windDirection: number
  windGust: number
  tempMax: number
  tempMin: number
  precipitationProbability: number
  updatedAt: string
}

export interface SunData {
  sunrise: string
  sunset: string
  updatedAt: string
}

export interface LakeLevel {
  current: number // cm relative to BSL (琵琶湖水位基準面)
  diffFromYesterday: number | null
  updatedAt: string
}

export interface WaterTemperature {
  current: number
  diffFromYesterday: number | null
  updatedAt: string
}

export interface TideEntry {
  time: string // HH:MM
  type: 'high' | 'low'
  height: number
}

export interface TideData {
  entries: TideEntry[]
  note: string
  updatedAt: string
}

export type DataResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
