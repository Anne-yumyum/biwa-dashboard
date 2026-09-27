export interface MemoConditions {
  area: string
  windSpeed?: number
  windGust?: number
  windDirection?: string
  weather?: string
  temperature?: number
  tideHigh?: string
  tideLow?: string
}

export interface Memo {
  id: string
  createdAt: string
  lat?: number
  lon?: number
  spot: string
  fish: string
  count: number
  sizes?: string[]
  /** 旧形式（1件に1サイズ）。読み込み互換のため残す */
  size?: string
  tackle: string
  note: string
  conditions: MemoConditions
}

const KEY = 'biwamasu-navi:memos'

export function loadMemos(): Memo[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Memo[]) : []
  } catch {
    return []
  }
}

function saveMemos(memos: Memo[]): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(memos))
    return true
  } catch {
    return false
  }
}

export function addMemo(memo: Memo): boolean {
  return saveMemos([memo, ...loadMemos()])
}

export function deleteMemo(id: string): boolean {
  return saveMemos(loadMemos().filter(m => m.id !== id))
}

export function importMemos(incoming: Memo[]): number {
  const current = loadMemos()
  const ids = new Set(current.map(m => m.id))
  const added = incoming.filter(m => m && m.id && !ids.has(m.id))
  saveMemos([...added, ...current].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  return added.length
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('ja-JP', {
    month: 'numeric', day: 'numeric', weekday: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo',
  })
}

export function memoSizes(m: Memo): string[] {
  if (m.sizes) return m.sizes.filter(s => s.trim() !== '')
  return m.size ? [m.size] : []
}

export function catchSummary(m: Memo): string {
  const sizes = memoSizes(m)
  return `${m.fish} ${m.count}匹${sizes.length ? `（${sizes.map(s => `${s}cm`).join('・')}）` : ''}`
}

export function formatLatLon(m: Memo): string | null {
  if (m.lat === undefined || m.lon === undefined) return null
  return `北緯 ${m.lat.toFixed(5)}° / 東経 ${m.lon.toFixed(5)}°`
}

export function memoToText(m: Memo): string {
  const c = m.conditions
  const lines = [
    `【ビワマスナビ 釣果メモ】`,
    `📅 ${formatDateTime(m.createdAt)}`,
    `📍 ${m.spot || '（スポット未入力）'}（${c.area}）`,
  ]
  const ll = formatLatLon(m)
  if (ll) lines.push(`🧭 ${ll}`)
  lines.push(`🐟 ${catchSummary(m)}`)
  if (m.tackle) lines.push(`🎣 ${m.tackle}`)
  const wind = c.windSpeed !== undefined
    ? `🌬 ${c.windDirection ?? ''} ${c.windSpeed}m/s（突風${c.windGust ?? '-'}m/s）`
    : null
  if (wind) lines.push(wind)
  if (c.weather) lines.push(`🌤 ${c.weather}${c.temperature !== undefined ? ` ${c.temperature}℃` : ''}`)
  if (c.tideHigh || c.tideLow) lines.push(`🌊 満潮${c.tideHigh ?? '-'} / 干潮${c.tideLow ?? '-'}`)
  if (m.note) lines.push(`📝 ${m.note}`)
  return lines.join('\n')
}
