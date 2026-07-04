'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Area } from '@/lib/areas'

interface DailyForecast {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipProbability: number
  windSpeedMax: number
  windDirection: number
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

function decodeWeatherCode(code: number): { label: string; emoji: string } {
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

function decodeWindDirection(deg: number): string {
  const dirs = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東',
                 '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西']
  return dirs[Math.round(deg / 22.5) % 16]
}

function windStatus(speed: number) {
  if (speed < 2.5) return { label: 'イケる', color: '#059669' }
  if (speed < 3.5) return { label: 'ヤバい', color: '#d97706' }
  return { label: '死ぬで', color: '#dc2626' }
}

function WindArrow({ deg, color, size = 18 }: { deg: number; color: string; size?: number }) {
  const r = (deg + 180) % 360
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ transform: `rotate(${r}deg)`, flexShrink: 0 }}>
      <line x1="16" y1="27" x2="16" y2="7" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <polyline points="8,14 16,5 24,14" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AreaDetail({ area }: { area: Area }) {
  const [daily, setDaily] = useState<DailyForecast[] | 'error' | undefined>(undefined)

  const load = useCallback(async () => {
    setDaily(undefined)
    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast')
      url.searchParams.set('latitude', String(area.lat))
      url.searchParams.set('longitude', String(area.lon))
      url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant')
      url.searchParams.set('timezone', 'Asia/Tokyo')
      url.searchParams.set('wind_speed_unit', 'ms')
      url.searchParams.set('forecast_days', '10')

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const d = json.daily

      setDaily((d.time as string[]).map((isoDate, i) => {
        const dt = new Date(isoDate + 'T00:00:00+09:00')
        return {
          date: `${dt.getMonth() + 1}/${dt.getDate()}(${WEEKDAYS[dt.getDay()]})`,
          weatherCode: d.weather_code[i],
          tempMax: Math.round(d.temperature_2m_max[i] * 10) / 10,
          tempMin: Math.round(d.temperature_2m_min[i] * 10) / 10,
          precipProbability: d.precipitation_probability_max[i] ?? 0,
          windSpeedMax: Math.round(d.wind_speed_10m_max[i] * 10) / 10,
          windDirection: d.wind_direction_10m_dominant[i],
        }
      }))
    } catch {
      setDaily('error')
    }
  }, [area])

  useEffect(() => { load() }, [load])

  if (daily === undefined) {
    return (
      <div className="card">
        <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>読み込み中…</p>
      </div>
    )
  }

  if (daily === 'error') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '20px 12px' }}>
        <p style={{ color: '#94a3b8', fontSize: 13 }}>データ取得できませんでした</p>
        <button
          onClick={load}
          style={{
            marginTop: 10, padding: '6px 20px', fontSize: 12, fontWeight: 700,
            background: '#0a3358', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
          }}
        >再読み込み</button>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <p className="card-label" style={{ marginBottom: 8 }}>10日間の天気・風</p>
        {daily.map((day, i) => {
          const st = windStatus(day.windSpeedMax)
          const wx = decodeWeatherCode(day.weatherCode)
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 0',
              borderBottom: i < daily.length - 1 ? '1px solid #f1f5f9' : 'none',
            }}>
              <p style={{
                fontSize: 12, fontWeight: 700, width: 64, flexShrink: 0,
                color: i === 0 ? '#0a3358' : '#475569',
              }}>
                {i === 0 ? '今日' : day.date}
              </p>
              <div style={{ width: 60, flexShrink: 0, textAlign: 'center' }}>
                <span style={{ fontSize: 20 }}>{wx.emoji}</span>
                <p style={{ fontSize: 9, color: '#64748b' }}>☔{day.precipProbability}%</p>
              </div>
              <p style={{ fontSize: 12, flexShrink: 0, width: 74 }}>
                <span style={{ color: '#dc2626', fontWeight: 700 }}>{day.tempMax}</span>
                <span style={{ color: '#94a3b8' }}>/</span>
                <span style={{ color: '#3b82f6', fontWeight: 700 }}>{day.tempMin}℃</span>
              </p>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
                <WindArrow deg={day.windDirection} color={st.color} />
                <p style={{ fontSize: 9, color: '#94a3b8', width: 34 }}>{decodeWindDirection(day.windDirection)}</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: st.color, width: 32, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {day.windSpeedMax}
                </p>
                <p style={{ fontSize: 10, fontWeight: 700, color: st.color, width: 36 }}>{st.label}</p>
              </div>
            </div>
          )
        })}
        <p style={{ fontSize: 9, color: '#94a3b8', marginTop: 6, textAlign: 'right' }}>風速: 日最大 m/s　風向: 卓越風向</p>
      </div>

      <div className="card bg-slate-50 border-slate-200">
        <p className="card-label mb-2">観測地点</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>{area.name}</p>
        <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{area.lat}°N, {area.lon}°E</p>
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Open-Meteo Forecast API</p>
      </div>
    </>
  )
}
