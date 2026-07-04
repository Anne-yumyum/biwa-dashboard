'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AREAS } from '@/lib/areas'

interface DailyForecast {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipProbability: number
  windSpeedMax: number
  windDirection: number
}

interface AreaData {
  windSpeed: number
  windGust: number
  windDirection: number
  temperature: number
  weatherCode: number
  precipProbability: number
  tempMax: number
  tempMin: number
  daily: DailyForecast[]
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

function WindArrow({ deg, color, size = 40 }: { deg: number; color: string; size?: number }) {
  const r = (deg + 180) % 360
  return (
    <svg width={size} height={size} viewBox="0 0 32 32"
      style={{ transform: `rotate(${r}deg)`, flexShrink: 0 }}>
      <line x1="16" y1="27" x2="16" y2="7" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <polyline points="8,14 16,5 24,14" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AreaTabs() {
  const [activeId, setActiveId] = useState(AREAS[0].id)
  const [data, setData] = useState<Record<string, AreaData | 'error' | undefined>>({})

  const load = useCallback(async (id: string) => {
    const area = AREAS.find(a => a.id === id)
    if (!area) return
    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast')
      url.searchParams.set('latitude', String(area.lat))
      url.searchParams.set('longitude', String(area.lon))
      url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m')
      url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant')
      url.searchParams.set('timezone', 'Asia/Tokyo')
      url.searchParams.set('wind_speed_unit', 'ms')
      url.searchParams.set('forecast_days', '10')

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const c = json.current
      const d = json.daily

      setData(prev => ({
        ...prev,
        [id]: {
          windSpeed: Math.round(c.wind_speed_10m * 10) / 10,
          windGust: Math.round(c.wind_gusts_10m * 10) / 10,
          windDirection: c.wind_direction_10m,
          temperature: Math.round(c.temperature_2m * 10) / 10,
          weatherCode: c.weather_code,
          precipProbability: d.precipitation_probability_max[0] ?? 0,
          tempMax: Math.round(d.temperature_2m_max[0] * 10) / 10,
          tempMin: Math.round(d.temperature_2m_min[0] * 10) / 10,
          daily: (d.time as string[]).map((isoDate, i) => {
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
          }),
        },
      }))
    } catch {
      setData(prev => ({ ...prev, [id]: 'error' }))
    }
  }, [])

  useEffect(() => {
    if (data[activeId] === undefined) load(activeId)
  }, [activeId, data, load])

  const current = data[activeId]

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* タブバー */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
        {AREAS.map(area => {
          const active = area.id === activeId
          return (
            <button
              key={area.id}
              onClick={() => setActiveId(area.id)}
              style={{
                flex: 1,
                padding: '10px 0 8px',
                background: active ? '#0a3358' : 'transparent',
                color: active ? '#fff' : '#475569',
                border: 'none',
                borderBottom: active ? '3px solid #2d9cdb' : '3px solid transparent',
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {area.shortName}
              <span style={{ display: 'block', fontSize: 9, fontWeight: 600, opacity: 0.75, marginTop: 1 }}>
                {area.name.replace(/^.（|）$/g, '')}
              </span>
            </button>
          )
        })}
      </div>

      {/* コンテンツ */}
      <div style={{ padding: '12px 14px' }}>
        {current === undefined && (
          <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>読み込み中…</p>
        )}
        {current === 'error' && (
          <div style={{ textAlign: 'center', padding: '18px 0' }}>
            <p style={{ color: '#94a3b8', fontSize: 13 }}>データ取得できませんでした</p>
            <button
              onClick={() => { setData(prev => ({ ...prev, [activeId]: undefined })) }}
              style={{
                marginTop: 8, padding: '6px 18px', fontSize: 12, fontWeight: 700,
                background: '#0a3358', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer',
              }}
            >再読み込み</button>
          </div>
        )}
        {current && current !== 'error' && (() => {
          const st = windStatus(current.windSpeed)
          const wx = decodeWeatherCode(current.weatherCode)
          return (
            <div>
              {/* 風 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div>
                  <p className="data-label">風速</p>
                  <p style={{ fontSize: '2.4rem', fontWeight: 800, color: st.color, lineHeight: 1 }}>
                    {current.windSpeed}<span style={{ fontSize: 13, color: '#64748b', marginLeft: 2 }}>m/s</span>
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: st.color, marginTop: 2 }}>{st.label}</p>
                </div>
                <div>
                  <p className="data-label">最大瞬間</p>
                  <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#475569', lineHeight: 1 }}>
                    {current.windGust}<span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 2 }}>m/s</span>
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <WindArrow deg={current.windDirection} color={st.color} />
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{decodeWindDirection(current.windDirection)}</p>
                </div>
              </div>

              {/* 天気・気温 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9',
              }}>
                <span style={{ fontSize: 34 }}>{wx.emoji}</span>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{wx.label}</p>
                  <p style={{ fontSize: 11, color: '#64748b' }}>降水 {current.precipProbability}%</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ fontSize: '1.7rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                    {current.temperature}<span style={{ fontSize: 13, color: '#64748b' }}>℃</span>
                  </p>
                  <p style={{ fontSize: 11, marginTop: 2 }}>
                    <span style={{ color: '#dc2626', fontWeight: 700 }}>{current.tempMax}</span>
                    <span style={{ color: '#94a3b8' }}> / </span>
                    <span style={{ color: '#3b82f6', fontWeight: 700 }}>{current.tempMin}℃</span>
                  </p>
                </div>
              </div>

              {/* 詳細ページへの導線 */}
              <Link href={`/area/${activeId}`} style={{
                display: 'block',
                marginTop: 10,
                padding: '8px 0',
                textAlign: 'center',
                background: '#f1f5f9',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                color: '#0a3358',
                textDecoration: 'none',
              }}>
                10日間の天気・風向を見る ›
              </Link>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
