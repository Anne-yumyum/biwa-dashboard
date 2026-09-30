import Link from 'next/link'
import type { ReactNode } from 'react'
import { fetchSun } from '@/lib/sun'
import { calculateTides } from '@/lib/tide'
import { fetchLakeLevel } from '@/lib/lakeLevel'
import { fetchDischarge } from '@/lib/discharge'

const LEVEL_URL = 'http://www1.river.go.jp/cgi-bin/DspWaterData.exe?KIND=9&ID=306041286603280'
const DISCHARGE_URL = 'https://www.kkr.mlit.go.jp/biwako/index.html'

const cellStyle: React.CSSProperties = {
  background: '#f2f5f8',
  borderRadius: 10,
  padding: '7px 9px',
  textDecoration: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minWidth: 0,
}

function Label({ children }: { children: ReactNode }) {
  return <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, lineHeight: 1.2 }}>{children}</p>
}

function Value({ children, color = '#0f172a' }: { children: ReactNode; color?: string }) {
  return (
    <p style={{ fontSize: 15, fontWeight: 800, color, lineHeight: 1.25, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
      {children}
    </p>
  )
}

export function CellSkeleton() {
  return <div style={{ ...cellStyle, minHeight: 44 }} />
}

export async function MiniSun() {
  const r = await fetchSun()
  return (
    <Link href="/detail/sun" style={cellStyle}>
      <Label>☀️ 日の出 / 日の入 ›</Label>
      <Value color="#b45309">{r.success ? `${r.data.sunrise} / ${r.data.sunset}` : '--:-- / --:--'}</Value>
    </Link>
  )
}

export function MiniTide() {
  const r = calculateTides(new Date())
  const high = r.success ? r.data.entries.find(e => e.type === 'high') : undefined
  const low = r.success ? r.data.entries.find(e => e.type === 'low') : undefined
  return (
    <Link href="/detail/tide" style={cellStyle}>
      <Label>🌊 満潮 / 干潮 ›</Label>
      <Value color="#1e40af">{high?.time ?? '--:--'} / {low?.time ?? '--:--'}</Value>
    </Link>
  )
}

export async function MiniLevel() {
  const r = await fetchLakeLevel()
  if (!r.success) {
    return (
      <a href={LEVEL_URL} target="_blank" rel="noopener noreferrer" style={cellStyle}>
        <Label>📊 琵琶湖水位</Label>
        <Value color="#d97706">確認 ↗</Value>
      </a>
    )
  }
  const { current } = r.data
  return (
    <Link href="/detail/lake-level" style={cellStyle}>
      <Label>📊 琵琶湖水位 ›</Label>
      <Value>{current >= 0 ? '+' : ''}{current} cm</Value>
    </Link>
  )
}

export async function MiniDischarge() {
  const r = await fetchDischarge()
  if (!r.success) {
    return (
      <a href={DISCHARGE_URL} target="_blank" rel="noopener noreferrer" style={cellStyle}>
        <Label>💧 放流量（瀬田川）</Label>
        <Value color="#d97706">確認 ↗</Value>
      </a>
    )
  }
  return (
    <Link href="/detail/discharge" style={cellStyle}>
      <Label>💧 放流量 ›</Label>
      <Value>{r.data.current} m³/s</Value>
    </Link>
  )
}

const rowStyle: React.CSSProperties = {
  ...cellStyle,
  gridColumn: '1 / 3',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  minHeight: 40,
}

export function MiniDepth() {
  return (
    <Link href="/detail/depth" style={rowStyle}>
      <Label>🗺 琵琶湖 等深線（湖沼図）</Label>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#0369a1' }}>見る ›</span>
    </Link>
  )
}
