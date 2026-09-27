'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AREAS } from '@/lib/areas'
import { calculateTides } from '@/lib/tide'
import { MemoFab } from '@/components/memo/MemoFab'
import type { MemoConditions } from '@/lib/memo'

interface DailyForecast {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
  precipProbability: number
  windSpeedMax: number
  windDirection: number
}

interface HourlyWind {
  time: string
  direction: number
  speed: number
  gust: number
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
  hourly: HourlyWind[]
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

export function AreaTabs({ children }: { children?: React.ReactNode }) {
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
      url.searchParams.set('hourly', 'wind_direction_10m,wind_speed_10m,wind_gusts_10m')
      url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant')
      url.searchParams.set('timezone', 'Asia/Tokyo')
      url.searchParams.set('wind_speed_unit', 'ms')
      url.searchParams.set('forecast_days', '10')

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(10000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const c = json.current
      const d = json.daily
      const h = json.hourly

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
          hourly: (h.time as string[]).slice(0, 24).map((time, i) => ({
            time: time.slice(11, 16),
            direction: h.wind_direction_10m[i],
            speed: Math.round(h.wind_speed_10m[i] * 10) / 10,
            gust: Math.round(h.wind_gusts_10m[i] * 10) / 10,
          })),
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
  const activeArea = AREAS.find(a => a.id === activeId)!

  function buildConditions(areaId: string): MemoConditions {
    const area = AREAS.find(a => a.id === areaId) ?? activeArea
    const areaData = data[area.id]
    const tides = calculateTides(new Date())
    const entries = tides.success ? tides.data.entries : []
    const cond: MemoConditions = {
      area: area.name,
      tideHigh: entries.find(e => e.type === 'high')?.time,
      tideLow: entries.find(e => e.type === 'low')?.time,
    }
    if (areaData && areaData !== 'error') {
      cond.windSpeed = areaData.windSpeed
      cond.windGust = areaData.windGust
      cond.windDirection = decodeWindDirection(areaData.windDirection)
      cond.weather = decodeWeatherCode(areaData.weatherCode).label
      cond.temperature = areaData.temperature
    }
    return cond
  }

  function ensureLoaded(areaId: string) {
    if (data[areaId] === undefined) load(areaId)
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <MemoFab defaultAreaId={activeId} getConditions={buildConditions} onSelectArea={ensureLoaded} />
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 10px 6px' }}>
      <div className="card" style={{ padding: '10px 12px', flexShrink: 0, justifyContent: 'flex-start' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 2 }}>
          {activeArea.name}
        </p>
        {current === undefined && (
          <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: '40px 0' }}>読み込み中…</p>
        )}
        {current === 'error' && (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
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
              {/* 風（ヒーロー） */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div>
                  <p style={{ fontSize: '2.6rem', fontWeight: 800, color: st.color, lineHeight: 1 }}>
                    {current.windSpeed}<span style={{ fontSize: 13, color: '#64748b', marginLeft: 3 }}>m/s</span>
                  </p>
                  <span className={`pill ${st.label === 'イケる' ? 'pill-ok' : st.label === 'ヤバい' ? 'pill-warn' : 'pill-danger'}`}
                    style={{ display: 'inline-block', marginTop: 4 }}>
                    {st.label}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>最大瞬間</p>
                  <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#475569', lineHeight: 1.1 }}>
                    {current.windGust}<span style={{ fontSize: 11, color: '#94a3b8', marginLeft: 2 }}>m/s</span>
                  </p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <WindArrow deg={current.windDirection} color={st.color} size={36} />
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{decodeWindDirection(current.windDirection)}</p>
                </div>
              </div>

              {/* 天気・気温 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9',
              }}>
                <span style={{ fontSize: 24 }}>{wx.emoji}</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{wx.label}</p>
                <p style={{ fontSize: 11, color: '#64748b' }}>☔{current.precipProbability}%</p>
                <p style={{ marginLeft: 'auto', fontSize: 11, textAlign: 'right' }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#1e293b' }}>{current.temperature}℃</span>{' '}
                  <span style={{ color: '#dc2626', fontWeight: 700 }}>{current.tempMax}</span>
                  <span style={{ color: '#94a3b8' }}>/</span>
                  <span style={{ color: '#3b82f6', fontWeight: 700 }}>{current.tempMin}</span>
                </p>
              </div>

              {/* 1時間ごとの風向き */}
              <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>今日の風向き</p>
                  <p style={{ fontSize: 9, color: '#94a3b8' }}>上段: 風速 / 下段: 突風 (m/s)</p>
                </div>
                <div style={{ display: 'flex', gap: 4, overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 8 }}>
                  {current.hourly.map((h, i) => {
                    const color = windStatus(h.speed).color
                    return (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, minWidth: 34 }}>
                        <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, lineHeight: 1.2 }}>{h.time.slice(0, 2)}時</p>
                        <WindArrow deg={h.direction} color={color} size={16} />
                        <p style={{ fontSize: 10, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{h.speed}</p>
                        <p style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8', fontVariantNumeric: 'tabular-nums', lineHeight: 1.2 }}>{h.gust}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 10日間予報 */}
              <Link href={`/area/${activeId}`} style={{
                display: 'block',
                marginTop: 8,
                padding: '7px 0',
                textAlign: 'center',
                background: '#1a2b4b',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
              }}>
                10日間の天気・風向を見る ›
              </Link>
            </div>
          )
        })()}
      </div>

      {/* 共通情報グリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 6 }}>
        {children}
      </div>
      </div>

      {/* 下部タブバー（HIG） */}
      <nav style={{
        display: 'flex',
        flexShrink: 0,
        background: 'rgba(255,255,255,0.96)',
        borderTop: '1px solid #d0e4f0',
        paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
      }}>
        {AREAS.map(area => {
          const active = area.id === activeId
          return (
            <button
              key={area.id}
              onClick={() => setActiveId(area.id)}
              aria-current={active ? 'page' : undefined}
              style={{
                flex: 1,
                minHeight: 49,
                padding: '6px 0 2px',
                background: 'transparent',
                border: 'none',
                color: active ? '#006399' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <span style={{
                fontSize: 17, fontWeight: 800, lineHeight: 1,
                width: 30, height: 26, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? '#e0effd' : 'transparent',
              }}>{area.shortName}</span>
              <span style={{ fontSize: 10, fontWeight: 600 }}>
                {area.name.replace(/^.（|）$/g, '')}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
